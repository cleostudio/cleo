'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  BackSide,
  BufferGeometry,
  Clock,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Mesh,
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

import { formatLatLng, sceneToLatLng } from '~/lib/maps/geo'
import { sunDirectionScene } from '~/lib/maps/sun'
import { EARTH_TEXTURES } from '~/lib/maps/textures'

const EARTH_RADIUS = 1
const CLOUD_RADIUS = 1.008
const ATMOSPHERE_RADIUS = 1.045
const MIN_POLAR = 0.12
const MAX_POLAR = Math.PI - 0.12

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

  // Unpack a tangent-space normal from the packed map.
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
    // Rebuild an orthonormal frame if the derivatives are degenerate.
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

    // Soft terminator — atmosphere scatters a little past geometric night.
    float dayAmount = smoothstep(-0.12, 0.22, ndotl);
    float cityLights = smoothstep(0.15, 0.0, ndotl);

    vec3 color = mix(night * 0.55, day, dayAmount);
    // City lights only where the night map carries energy.
    color += night * cityLights * 1.35;

    // Specular ocean glint.
    vec3 viewDir = normalize(cameraPositionW - vPositionW);
    vec3 halfDir = normalize(sun + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 48.0) * ocean * dayAmount;
    color += vec3(0.55, 0.7, 0.85) * specular * 0.65;

    // Mild limb darkening so the disc reads round.
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

export function EarthGlobe() {
  const hostRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLParagraphElement>(null)
  const [status, setStatus] = useState<GlobeStatus>('loading')

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
      // Uniform-ish points on a large sphere.
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

    const loader = new TextureLoader()
    const loadTexture = (url: string, colorSpace: typeof SRGBColorSpace | typeof NoColorSpace) =>
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

    const updateReadout = () => {
      const el = readoutRef.current
      if (!el) return
      if (!pointerOver) {
        el.textContent = 'Drag to orbit · scroll to zoom'
        return
      }

      // Ray from camera through pointer → sphere.
      const ndcX = pointer.x
      const ndcY = pointer.y
      const rayOrigin = camera.position
      const rayDir = new Vector3(ndcX, ndcY, 0.5)
        .unproject(camera)
        .sub(rayOrigin)
        .normalize()

      // Analytic unit-sphere intersection in root-local space.
      root.updateMatrixWorld()
      const inv = root.matrixWorld.clone().invert()
      const localOrigin = rayOrigin.clone().applyMatrix4(inv)
      const localTarget = rayOrigin.clone().add(rayDir).applyMatrix4(inv)
      const localDir = localTarget.sub(localOrigin).normalize()

      const b = 2 * localOrigin.dot(localDir)
      const c = localOrigin.lengthSq() - EARTH_RADIUS * EARTH_RADIUS
      const disc = b * b - 4 * c
      if (disc < 0) {
        el.textContent = 'Open space'
        return
      }
      const t = (-b - Math.sqrt(disc)) / 2
      if (t < 0) {
        el.textContent = 'Open space'
        return
      }
      hitPoint.copy(localOrigin).addScaledVector(localDir, t)
      const { latitude, longitude } = sceneToLatLng(hitPoint.x, hitPoint.y, hitPoint.z)
      el.textContent = formatLatLng(latitude, longitude)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      pointerOver = true
      // Pause auto-spin while the user is aiming.
      if (!reducedMotion) controls.autoRotate = false
    }

    const onPointerLeave = () => {
      pointerOver = false
      if (!reducedMotion) controls.autoRotate = true
    }

    const onPointerDown = () => {
      if (!reducedMotion) controls.autoRotate = false
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()

    const tick = () => {
      if (disposed) return
      frameId = window.requestAnimationFrame(tick)
      const delta = clock.getDelta()
      applySun(new Date())
      camera.getWorldPosition(cameraPositionW)
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
          for (const texture of [dayMap, nightMap, specularMap, normalMap, cloudMap]) {
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
      controls.dispose()
      earthGeometry.dispose()
      cloudGeometry.dispose()
      atmosphereGeometry.dispose()
      starGeometry.dispose()
      ;(stars.material as PointsMaterial).dispose()
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
        Drag to orbit · scroll to zoom
      </p>
    </div>
  )
}
