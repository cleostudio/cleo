'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  BackSide,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  NoColorSpace,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
  cameraPositionForLatLng,
  MAPS_FOCUS_DISTANCE,
  slerpCameraPositions,
} from '~/lib/maps/camera'
import { formatLatLng, sceneToLatLng } from '~/lib/maps/geo'
import { getMapPlace, mapPlaces, nearestMapPlace } from '~/lib/maps/places'
import { sunDirectionScene } from '~/lib/maps/sun'
import { EARTH_TEXTURES } from '~/lib/maps/textures'

const EARTH_RADIUS = 1
const CLOUD_RADIUS = 1.008
const ATMOSPHERE_RADIUS = 1.045
const MARKER_RADIUS = 1.012
const MIN_POLAR = 0.12
const MAX_POLAR = Math.PI - 0.12
const CLICK_SLOP_PX = 5
const FLIGHT_MS = 900

const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPosition.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const earthFragment = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform sampler2D normalMap;
  uniform vec3 sunDirection;
  uniform vec3 cameraPositionW;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  vec3 perturbNormal(vec3 normal, vec3 position, vec2 uv) {
    vec3 mapN = texture2D(normalMap, uv).xyz * 2.0 - 1.0;
    mapN.xy *= 0.55;

    vec3 q0 = dFdx(position);
    vec3 q1 = dFdy(position);
    vec2 st0 = dFdx(uv);
    vec2 st1 = dFdy(uv);

    vec3 n = normalize(normal);
    vec3 s = normalize(q0 * st1.t - q1 * st0.t);
    vec3 t = normalize(-q0 * st1.s + q1 * st0.s);
    t = normalize(t - n * dot(n, t));
    s = cross(t, n);
    mat3 tbn = mat3(s, t, n);
    return normalize(tbn * mapN);
  }

  void main() {
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    float ocean = texture2D(specularMap, vUv).r;

    vec3 normal = perturbNormal(vNormalW, vPositionW, vUv);
    vec3 sun = normalize(sunDirection);
    float ndotl = dot(normal, sun);

    float dayAmount = smoothstep(-0.12, 0.22, ndotl);
    float cityLights = smoothstep(0.15, 0.0, ndotl);

    vec3 color = mix(night * 0.55, day, dayAmount);
    color += night * cityLights * 1.35;

    vec3 viewDir = normalize(cameraPositionW - vPositionW);
    vec3 halfDir = normalize(sun + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 48.0) * ocean * dayAmount;
    color += vec3(0.55, 0.7, 0.85) * specular * 0.65;

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.2);
    color += vec3(0.15, 0.35, 0.7) * fresnel * 0.12 * dayAmount;

    gl_FragColor = vec4(color, 1.0);
  }
`

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPosition.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const atmosphereFragment = /* glsl */ `
  uniform vec3 sunDirection;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    vec3 normal = normalize(vNormalW);
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
    float sunFacing = smoothstep(-0.3, 0.65, dot(normal, normalize(sunDirection)));
    vec3 glow = mix(vec3(0.15, 0.35, 0.85), vec3(0.45, 0.75, 1.0), sunFacing);
    float alpha = fresnel * (0.35 + 0.55 * sunFacing);
    gl_FragColor = vec4(glow, alpha);
  }
`

const cloudVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const cloudFragment = /* glsl */ `
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vec4 clouds = texture2D(cloudMap, vUv);
    float cover = max(clouds.r, max(clouds.g, clouds.b));
    float light = smoothstep(-0.2, 0.55, dot(normalize(vNormalW), normalize(sunDirection)));
    float alpha = cover * (0.22 + 0.55 * light);
    vec3 color = mix(vec3(0.45, 0.5, 0.6), vec3(1.0), light);
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`

type GlobeStatus = 'loading' | 'ready' | 'unsupported' | 'error'

export type EarthGlobeProps = {
  selectedSlug: string | null
  focusToken: number
  onSelect: (slug: string | null) => void
}

export function EarthGlobe({
  selectedSlug,
  focusToken,
  onSelect,
}: EarthGlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLParagraphElement>(null)
  const onSelectRef = useRef(onSelect)
  const selectedSlugRef = useRef(selectedSlug)
  const [status, setStatus] = useState<GlobeStatus>('loading')

  onSelectRef.current = onSelect
  selectedSlugRef.current = selectedSlug

  // Imperative focus requests from React (search / card).
  const focusRequestRef = useRef<{ slug: string; token: number } | null>(null)
  useEffect(() => {
    if (!selectedSlug) return
    focusRequestRef.current = { slug: selectedSlug, token: focusToken }
  }, [selectedSlug, focusToken])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      setStatus('unsupported')
      return
    }

    if (!renderer.capabilities.isWebGL2 && !renderer.getContext()) {
      renderer.dispose()
      setStatus('unsupported')
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)
    renderer.domElement.className = 'maps-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')

    const scene = new Scene()
    const camera = new PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0.35, 0.55, 2.65)

    const ambient = new AmbientLight(0x6a7a9a, 0.18)
    const sunLight = new DirectionalLight(0xfff4e5, 1.35)
    scene.add(ambient, sunLight)

    const root = new Group()
    scene.add(root)

    const earthGeometry = new SphereGeometry(EARTH_RADIUS, 96, 64)
    const cloudGeometry = new SphereGeometry(CLOUD_RADIUS, 96, 64)
    const atmosphereGeometry = new SphereGeometry(ATMOSPHERE_RADIUS, 64, 48)

    const sunDirection = new Vector3(1, 0, 0)
    const cameraPositionW = new Vector3()

    const earthMaterial = new ShaderMaterial({
      uniforms: {
        dayMap: { value: null },
        nightMap: { value: null },
        specularMap: { value: null },
        normalMap: { value: null },
        sunDirection: { value: sunDirection },
        cameraPositionW: { value: cameraPositionW },
      },
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    })

    const starGeometry = new BufferGeometry()
    const starCount = 1400
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i += 1) {
      const radius = 28 + Math.random() * 16
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const sinPhi = Math.sin(phi)
      starPositions[i * 3] = radius * sinPhi * Math.cos(theta)
      starPositions[i * 3 + 1] = radius * Math.cos(phi)
      starPositions[i * 3 + 2] = radius * sinPhi * Math.sin(theta)
    }
    starGeometry.setAttribute('position', new Float32BufferAttribute(starPositions, 3))
    const stars = new Points(
      starGeometry,
      new PointsMaterial({
        color: 0xb8c4d8,
        size: 0.045,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    )
    scene.add(stars)

    const cloudMaterial = new ShaderMaterial({
      uniforms: {
        cloudMap: { value: null },
        sunDirection: { value: sunDirection },
      },
      vertexShader: cloudVertex,
      fragmentShader: cloudFragment,
      transparent: true,
      depthWrite: false,
    })

    const atmosphereMaterial = new ShaderMaterial({
      uniforms: {
        sunDirection: { value: sunDirection },
      },
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      transparent: true,
      depthWrite: false,
      side: BackSide,
    })

    const earth = new Mesh(earthGeometry, earthMaterial)
    const clouds = new Mesh(cloudGeometry, cloudMaterial)
    const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial)
    root.add(earth, clouds, atmosphere)

    // Country markers — one Points cloud for every Explore guide.
    const markerPositions = new Float32Array(mapPlaces.length * 3)
    mapPlaces.forEach((place, index) => {
      const [x, y, z] = place.direction
      markerPositions[index * 3] = x * MARKER_RADIUS
      markerPositions[index * 3 + 1] = y * MARKER_RADIUS
      markerPositions[index * 3 + 2] = z * MARKER_RADIUS
    })
    const markerGeometry = new BufferGeometry()
    markerGeometry.setAttribute(
      'position',
      new Float32BufferAttribute(markerPositions, 3),
    )
    const markerMaterial = new PointsMaterial({
      color: new Color('#c96442'),
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
    // Prefer the live --signal token when the theme exposes a parseable color.
    const signal = getComputedStyle(document.documentElement)
      .getPropertyValue('--signal')
      .trim()
    if (signal) {
      try {
        markerMaterial.color.set(signal)
      } catch {
        // Keep the terracotta fallback when the token is an unsupported format.
      }
    }
    const markers = new Points(markerGeometry, markerMaterial)
    root.add(markers)

    const selectionGeometry = new SphereGeometry(0.018, 16, 12)
    const selectionMaterial = new MeshBasicMaterial({
      color: markerMaterial.color.clone(),
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    })
    const selectionMarker = new Mesh(selectionGeometry, selectionMaterial)
    selectionMarker.visible = false
    root.add(selectionMarker)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 1.55
    controls.maxDistance = 4.5
    controls.minPolarAngle = MIN_POLAR
    controls.maxPolarAngle = MAX_POLAR
    controls.autoRotate = !reducedMotion
    controls.autoRotateSpeed = 0.28
    controls.rotateSpeed = 0.55
    controls.zoomSpeed = 0.7

    const clock = new Clock()
    const pointer = new Vector2(2, 2)
    const hitPoint = new Vector3()
    let frameId = 0
    let disposed = false
    let pointerOver = false
    let pointerDown: { x: number; y: number } | null = null
    let flight:
      | {
          from: [number, number, number]
          to: [number, number, number]
          startedAt: number
        }
      | null = null
    let lastFocusToken = -1

    const loader = new TextureLoader()
    const loadTexture = (
      url: string,
      colorSpace: typeof SRGBColorSpace | typeof NoColorSpace,
    ) =>
      new Promise<Texture>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = colorSpace
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
            resolve(texture)
          },
          undefined,
          reject,
        )
      })

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = host
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const applySun = (date: Date) => {
      const [x, y, z] = sunDirectionScene(date)
      sunDirection.set(x, y, z).normalize()
      sunLight.position.copy(sunDirection).multiplyScalar(8)
    }

    const intersectGlobe = (): [number, number, number] | null => {
      const rayOrigin = camera.position
      const rayDir = new Vector3(pointer.x, pointer.y, 0.5)
        .unproject(camera)
        .sub(rayOrigin)
        .normalize()

      root.updateMatrixWorld()
      const inv = root.matrixWorld.clone().invert()
      const localOrigin = rayOrigin.clone().applyMatrix4(inv)
      const localTarget = rayOrigin.clone().add(rayDir).applyMatrix4(inv)
      const localDir = localTarget.sub(localOrigin).normalize()

      const b = 2 * localOrigin.dot(localDir)
      const c = localOrigin.lengthSq() - EARTH_RADIUS * EARTH_RADIUS
      const disc = b * b - 4 * c
      if (disc < 0) return null
      const t = (-b - Math.sqrt(disc)) / 2
      if (t < 0) return null
      hitPoint.copy(localOrigin).addScaledVector(localDir, t)
      return [hitPoint.x, hitPoint.y, hitPoint.z]
    }

    const placeSelectionMarker = (slug: string | null) => {
      const place = slug ? getMapPlace(slug) : undefined
      if (!place) {
        selectionMarker.visible = false
        return
      }
      const [x, y, z] = place.direction
      selectionMarker.position.set(x * 1.02, y * 1.02, z * 1.02)
      selectionMarker.visible = true
    }

    const beginFlightTo = (slug: string) => {
      const place = getMapPlace(slug)
      if (!place) return
      const to = cameraPositionForLatLng(
        place.latitude,
        place.longitude,
        MAPS_FOCUS_DISTANCE,
      )
      if (reducedMotion) {
        camera.position.set(...to)
        controls.target.set(0, 0, 0)
        controls.update()
        flight = null
        return
      }
      flight = {
        from: [camera.position.x, camera.position.y, camera.position.z],
        to,
        startedAt: performance.now(),
      }
      controls.autoRotate = false
    }

    const updateReadout = () => {
      const el = readoutRef.current
      if (!el) return
      if (!pointerOver) {
        el.textContent = 'Drag to orbit · click a country · scroll to zoom'
        return
      }

      const hit = intersectGlobe()
      if (!hit) {
        el.textContent = 'Open space'
        return
      }
      const { latitude, longitude } = sceneToLatLng(...hit)
      const place = nearestMapPlace(hit)
      el.textContent = place
        ? `${place.name} · ${formatLatLng(latitude, longitude)}`
        : formatLatLng(latitude, longitude)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      pointerOver = true
      if (!reducedMotion && !flight) controls.autoRotate = false
    }

    const onPointerLeave = () => {
      pointerOver = false
      pointerDown = null
      if (!reducedMotion && !flight && !selectedSlugRef.current) {
        controls.autoRotate = true
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = { x: event.clientX, y: event.clientY }
      if (!reducedMotion) controls.autoRotate = false
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!pointerDown) return
      const dx = event.clientX - pointerDown.x
      const dy = event.clientY - pointerDown.y
      pointerDown = null
      if (dx * dx + dy * dy > CLICK_SLOP_PX * CLICK_SLOP_PX) return

      const hit = intersectGlobe()
      if (!hit) {
        onSelectRef.current(null)
        placeSelectionMarker(null)
        return
      }
      const place = nearestMapPlace(hit)
      if (!place) {
        onSelectRef.current(null)
        placeSelectionMarker(null)
        return
      }
      onSelectRef.current(place.slug)
      placeSelectionMarker(place.slug)
      beginFlightTo(place.slug)
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    placeSelectionMarker(selectedSlugRef.current)

    const tick = () => {
      if (disposed) return
      frameId = window.requestAnimationFrame(tick)
      const delta = clock.getDelta()
      applySun(new Date())
      camera.getWorldPosition(cameraPositionW)

      const request = focusRequestRef.current
      if (request && request.token !== lastFocusToken) {
        lastFocusToken = request.token
        placeSelectionMarker(request.slug)
        beginFlightTo(request.slug)
      }

      if (flight) {
        const t = (performance.now() - flight.startedAt) / FLIGHT_MS
        const position = slerpCameraPositions(flight.from, flight.to, t)
        camera.position.set(...position)
        controls.target.set(0, 0, 0)
        if (t >= 1) flight = null
      }

      if (!reducedMotion) {
        clouds.rotation.y += delta * 0.012
      }
      controls.update()
      updateReadout()
      renderer.render(scene, camera)
    }

    void (async () => {
      try {
        const [dayMap, nightMap, specularMap, normalMap, cloudMap] =
          await Promise.all([
            loadTexture(EARTH_TEXTURES.day, SRGBColorSpace),
            loadTexture(EARTH_TEXTURES.night, SRGBColorSpace),
            loadTexture(EARTH_TEXTURES.specular, NoColorSpace),
            loadTexture(EARTH_TEXTURES.normal, NoColorSpace),
            loadTexture(EARTH_TEXTURES.clouds, SRGBColorSpace),
          ])

        if (disposed) {
          for (const texture of [
            dayMap,
            nightMap,
            specularMap,
            normalMap,
            cloudMap,
          ]) {
            texture.dispose()
          }
          return
        }

        earthMaterial.uniforms.dayMap.value = dayMap
        earthMaterial.uniforms.nightMap.value = nightMap
        earthMaterial.uniforms.specularMap.value = specularMap
        earthMaterial.uniforms.normalMap.value = normalMap
        cloudMaterial.uniforms.cloudMap.value = cloudMap

        applySun(new Date())
        setStatus('ready')
        tick()
      } catch {
        if (!disposed) setStatus('error')
      }
    })()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      controls.dispose()
      earthGeometry.dispose()
      cloudGeometry.dispose()
      atmosphereGeometry.dispose()
      starGeometry.dispose()
      markerGeometry.dispose()
      selectionGeometry.dispose()
      ;(stars.material as PointsMaterial).dispose()
      markerMaterial.dispose()
      selectionMaterial.dispose()
      earthMaterial.dispose()
      cloudMaterial.dispose()
      atmosphereMaterial.dispose()
      for (const material of [earthMaterial, cloudMaterial]) {
        for (const uniform of Object.values(material.uniforms)) {
          const value = uniform.value
          if (value && typeof value === 'object' && 'dispose' in value) {
            ;(value as { dispose: () => void }).dispose()
          }
        }
      }
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className="maps-globe">
      <div ref={hostRef} className="maps-globe-stage" />
      {status === 'loading' ? (
        <p className="maps-globe-status" role="status">
          Loading Earth…
        </p>
      ) : null}
      {status === 'unsupported' ? (
        <p className="maps-globe-status" role="alert">
          WebGL is unavailable in this browser, so the globe cannot render.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="maps-globe-status" role="alert">
          Earth textures failed to load.
        </p>
      ) : null}
      <p ref={readoutRef} className="maps-globe-readout" aria-live="polite">
        Drag to orbit · click a country · scroll to zoom
      </p>
    </div>
  )
}
