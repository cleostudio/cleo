'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { framingPosition, stepCameraToward } from '~/lib/maps/camera'
import { createGraticuleGeometry } from '~/lib/maps/graticule'
import {
  formatLatLon,
  latLonToVector3,
  mapsMarkers,
  vector3ToLatLon,
  type MapsCoords,
  type MapsMarker,
} from '~/lib/maps/markers'
import { sunDirectionAt } from '~/lib/maps/sun'
import { MAPS_TEXTURE_CREDIT, MAPS_TEXTURES } from '~/lib/maps/textures'

const EARTH_RADIUS = 1
const CLOUD_RADIUS = 1.012
const ATMOSPHERE_RADIUS = 1.048
const MARKER_RADIUS = 1.02
const FLY_DISTANCE = 1.95
const FLY_MS = 900
/** Obliquity of the ecliptic — Earth's axial tilt toward the ecliptic pole. */
const AXIAL_TILT_RAD = (23.44 * Math.PI) / 180
const SPHERE_WIDTH_SEGMENTS = 128
const SPHERE_HEIGHT_SEGMENTS = 96

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
    gl_FragColor = vec4(0.35, 0.55, 1.0, 1.0) * intensity;
  }
`

type HoverState = {
  marker: MapsMarker
  x: number
  y: number
}

type GlobeApi = {
  flyTo: (marker: MapsMarker) => void
  setHighlight: (marker: MapsMarker | null) => void
  setGraticuleVisible: (visible: boolean) => void
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function createStarfield(count = 1800) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const radius = 40 + Math.random() * 60
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const material = new PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  })
  return new Points(geometry, material)
}

function createMarkerPoints(markers: MapsMarker[]) {
  const positions = new Float32Array(markers.length * 3)
  for (let i = 0; i < markers.length; i += 1) {
    const [x, y, z] = latLonToVector3(markers[i].lat, markers[i].lon, MARKER_RADIUS)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const material = new PointsMaterial({
    color: new Color('#f4f1ea'),
    size: 0.018,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
  })
  const points = new Points(geometry, material)
  points.name = 'country-markers'
  return points
}

export function EarthGlobe({
  focusSlug = null,
  onSelect,
  onPickCoords,
  showGraticule = false,
}: {
  focusSlug?: string | null
  onSelect?: (marker: MapsMarker | null) => void
  onPickCoords?: (coords: MapsCoords | null) => void
  showGraticule?: boolean
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<GlobeApi | null>(null)
  const onSelectRef = useRef(onSelect)
  const onPickCoordsRef = useRef(onPickCoords)
  const markers = useRef(mapsMarkers()).current
  const markersBySlug = useRef(
    new Map(markers.map((marker) => [marker.slug, marker])),
  ).current
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [hover, setHover] = useState<HoverState | null>(null)
  const [pickedLabel, setPickedLabel] = useState<string | null>(null)

  onSelectRef.current = onSelect
  onPickCoordsRef.current = onPickCoords

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let frameId = 0
    let renderer: WebGLRenderer | undefined
    let controls: OrbitControls | undefined
    let clouds: Mesh | undefined
    let markersPoints: Points | undefined
    let highlight: Mesh | undefined
    let earthMesh: Mesh | undefined
    let graticule: LineSegments | undefined
    let root: Group | undefined
    let camera: PerspectiveCamera | undefined
    let sun: DirectionalLight | undefined
    let nightSunUniform: { value: Vector3 } | null = null
    const disposables: Array<{ dispose: () => void }> = []

    const scene = new Scene()
    scene.background = new Color('#03060d')

    camera = new PerspectiveCamera(
      42,
      host.clientWidth / Math.max(host.clientHeight, 1),
      0.1,
      200,
    )
    camera.position.set(0.35, 0.55, 2.65)

    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      })
    } catch {
      setFailed(true)
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.outputColorSpace = SRGBColorSpace
    host.appendChild(renderer.domElement)
    renderer.domElement.className = 'maps-canvas'
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D Earth')
    renderer.domElement.setAttribute('role', 'img')

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 1.45
    controls.maxDistance = 4.8
    controls.autoRotate = !prefersReducedMotion()
    controls.autoRotateSpeed = 0.28
    controls.target.set(0, 0, 0)

    const ambient = new AmbientLight(0x6d7a99, 0.55)
    scene.add(ambient)

    const stars = createStarfield()
    scene.add(stars)
    disposables.push(stars.geometry, stars.material as PointsMaterial)

    root = new Group()
    scene.add(root)

    const [sx, sy, sz] = sunDirectionAt(new Date())
    sun = new DirectionalLight(0xfff2d6, 2.35)
    sun.position.set(sx * 8, sy * 8, sz * 8)
    // Parent under the globe so geographic sun directions stay on the texture
    // while the axial tilt still leans the whole planet in view.
    root.add(sun)

    const sphere = new SphereGeometry(
      EARTH_RADIUS,
      SPHERE_WIDTH_SEGMENTS,
      SPHERE_HEIGHT_SEGMENTS,
    )
    disposables.push(sphere)

    root.rotation.order = 'ZXY'
    root.rotation.z = AXIAL_TILT_RAD

    const loader = new TextureLoader()
    const loadTexture = (url: string) =>
      new Promise<Awaited<ReturnType<typeof loader.loadAsync>>>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = SRGBColorSpace
            texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1
            resolve(texture)
          },
          undefined,
          reject,
        )
      })

    const pointer = new Vector2()
    const raycaster = new Raycaster()
    raycaster.params.Points = { threshold: 0.035 }

    let pointerDown = { x: 0, y: 0, t: 0 }
    let idleResume: number | null = null
    let flight:
      | {
          from: Vector3
          to: Vector3
          started: number
        }
      | null = null

    const pauseAutoRotate = (resumeMs = 4500) => {
      if (!controls) return
      controls.autoRotate = false
      if (idleResume !== null) window.clearTimeout(idleResume)
      idleResume = window.setTimeout(() => {
        if (!controls || prefersReducedMotion() || flight) return
        controls.autoRotate = true
      }, resumeMs)
    }

    const setHighlight = (marker: MapsMarker | null) => {
      if (!highlight || !root) return
      if (!marker) {
        highlight.visible = false
        return
      }
      const [x, y, z] = latLonToVector3(marker.lat, marker.lon, MARKER_RADIUS + 0.004)
      highlight.position.set(x, y, z)
      highlight.visible = true
    }

    const flyTo = (marker: MapsMarker) => {
      if (!camera || !controls || !root) return
      setHighlight(marker)
      root.updateMatrixWorld(true)
      const local = new Vector3(...latLonToVector3(marker.lat, marker.lon, 1))
      const world = local.applyMatrix4(root.matrixWorld)
      const [tx, ty, tz] = framingPosition(world, FLY_DISTANCE)
      const to = new Vector3(tx, ty, tz)
      if (prefersReducedMotion()) {
        camera.position.copy(to)
        controls.update()
        flight = null
        return
      }
      flight = {
        from: camera.position.clone(),
        to,
        started: performance.now(),
      }
      pauseAutoRotate(FLY_MS + 5000)
    }

    const setGraticuleVisible = (visible: boolean) => {
      if (graticule) graticule.visible = visible
    }

    apiRef.current = { flyTo, setHighlight, setGraticuleVisible }

    const onPointerMove = (event: PointerEvent) => {
      if (!renderer || !markersPoints || !camera) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(markersPoints, false)
      if (hits[0]?.index != null) {
        const marker = markers[hits[0].index]
        setHover({ marker, x: event.clientX - rect.left, y: event.clientY - rect.top })
        renderer.domElement.style.cursor = 'pointer'
      } else {
        setHover(null)
        renderer.domElement.style.cursor = 'grab'
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = { x: event.clientX, y: event.clientY, t: performance.now() }
      pauseAutoRotate()
      if (renderer) renderer.domElement.style.cursor = 'grabbing'
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!renderer || !markersPoints || !camera) return
      renderer.domElement.style.cursor = 'grab'
      const moved =
        Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 6
      const elapsed = performance.now() - pointerDown.t
      if (moved || elapsed > 700) return

      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const markerHits = raycaster.intersectObject(markersPoints, false)
      if (markerHits[0]?.index != null) {
        setPickedLabel(null)
        onPickCoordsRef.current?.(null)
        onSelectRef.current?.(markers[markerHits[0].index])
        return
      }

      if (!earthMesh) return
      const earthHits = raycaster.intersectObject(earthMesh, false)
      const point = earthHits[0]?.point
      if (!point || !root) return
      // Convert world hit into the globe's local geographic frame.
      const local = root.worldToLocal(point.clone())
      const coords = vector3ToLatLon(local.x, local.y, local.z)
      setPickedLabel(formatLatLon(coords.lat, coords.lon))
      onPickCoordsRef.current?.(coords)
      onSelectRef.current?.(null)
    }

    const onWheel = () => pauseAutoRotate()

    const onResize = () => {
      if (!renderer || !host || !camera) return
      const width = host.clientWidth
      const height = Math.max(host.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    void (async () => {
      try {
        const [dayMap, nightMap, cloudMap, normalMap, specularMap] =
          await Promise.all([
            loadTexture(MAPS_TEXTURES.day),
            loadTexture(MAPS_TEXTURES.night),
            loadTexture(MAPS_TEXTURES.clouds),
            loadTexture(MAPS_TEXTURES.normal),
            loadTexture(MAPS_TEXTURES.specular),
          ])

        if (disposed || !root) {
          for (const texture of [dayMap, nightMap, cloudMap, normalMap, specularMap]) {
            texture.dispose()
          }
          return
        }

        disposables.push(dayMap, nightMap, cloudMap, normalMap, specularMap)

        const earthMaterial = new MeshPhongMaterial({
          map: dayMap,
          specularMap,
          specular: new Color(0x222222),
          shininess: 18,
          normalMap,
          normalScale: new Vector2(0.65, 0.65),
        })
        earthMesh = new Mesh(sphere, earthMaterial)
        root.add(earthMesh)
        disposables.push(earthMaterial)

        const nightMaterial = new MeshPhongMaterial({
          map: nightMap,
          transparent: true,
          opacity: 0.95,
          blending: AdditiveBlending,
          depthWrite: false,
          shininess: 0,
          polygonOffset: true,
          polygonOffsetFactor: -1,
        })
        nightMaterial.customProgramCacheKey = () => 'maps-night-terminator-v2'
        nightMaterial.onBeforeCompile = (shader) => {
          const [dx, dy, dz] = sunDirectionAt(new Date())
          shader.uniforms.uSunDirection = { value: new Vector3(dx, dy, dz) }
          nightSunUniform = shader.uniforms.uSunDirection
          shader.vertexShader = shader.vertexShader
            .replace(
              '#include <common>',
              `#include <common>
               varying vec3 vObjectNormal;`,
            )
            .replace(
              '#include <beginnormal_vertex>',
              `#include <beginnormal_vertex>
               vObjectNormal = normalize(objectNormal);`,
            )
          shader.fragmentShader = shader.fragmentShader
            .replace(
              '#include <common>',
              `#include <common>
               uniform vec3 uSunDirection;
               varying vec3 vObjectNormal;`,
            )
            .replace(
              '#include <dithering_fragment>',
              `float nightFactor = 1.0 - smoothstep(-0.05, 0.18, dot(normalize(vObjectNormal), normalize(uSunDirection)));
               gl_FragColor.rgb *= nightFactor;
               gl_FragColor.a *= nightFactor;
               #include <dithering_fragment>`,
            )
        }
        const night = new Mesh(sphere, nightMaterial)
        night.renderOrder = 1
        root.add(night)
        disposables.push(nightMaterial)

        const cloudMaterial = new MeshPhongMaterial({
          map: cloudMap,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
          specular: new Color(0x000000),
        })
        clouds = new Mesh(
          new SphereGeometry(
            CLOUD_RADIUS,
            SPHERE_WIDTH_SEGMENTS,
            SPHERE_HEIGHT_SEGMENTS,
          ),
          cloudMaterial,
        )
        root.add(clouds)
        disposables.push(clouds.geometry, cloudMaterial)

        const atmosphereMaterial = new ShaderMaterial({
          vertexShader: atmosphereVertex,
          fragmentShader: atmosphereFragment,
          blending: AdditiveBlending,
          side: BackSide,
          transparent: true,
          depthWrite: false,
        })
        const atmosphere = new Mesh(
          new SphereGeometry(ATMOSPHERE_RADIUS, 80, 80),
          atmosphereMaterial,
        )
        root.add(atmosphere)
        disposables.push(atmosphere.geometry, atmosphereMaterial)

        const graticuleGeometry = createGraticuleGeometry(1.004, 30)
        const graticuleMaterial = new LineBasicMaterial({
          color: new Color('#d7e0f5'),
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        })
        graticule = new LineSegments(graticuleGeometry, graticuleMaterial)
        graticule.visible = false
        graticule.renderOrder = 1
        root.add(graticule)
        disposables.push(graticuleGeometry, graticuleMaterial)

        markersPoints = createMarkerPoints(markers)
        root.add(markersPoints)
        disposables.push(
          markersPoints.geometry,
          markersPoints.material as PointsMaterial,
        )

        const highlightMaterial = new MeshBasicMaterial({
          color: new Color('#f4f1ea'),
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
        })
        highlight = new Mesh(new SphereGeometry(0.012, 16, 16), highlightMaterial)
        highlight.visible = false
        highlight.renderOrder = 2
        root.add(highlight)
        disposables.push(highlight.geometry, highlightMaterial)

        // Start over the Atlantic looking toward Europe / Africa.
        root.rotation.y = -0.55

        setReady(true)
      } catch {
        if (!disposed) setFailed(true)
      }
    })()

    const canvas = renderer.domElement
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('resize', onResize)

    const tick = () => {
      if (disposed || !renderer || !controls || !camera) return
      frameId = window.requestAnimationFrame(tick)
      if (clouds) clouds.rotation.y += 0.00035
      if (highlight?.visible) {
        const pulse = 0.9 + Math.sin(performance.now() / 280) * 0.18
        highlight.scale.setScalar(pulse)
      }
      if (flight) {
        const t = (performance.now() - flight.started) / FLY_MS
        stepCameraToward(camera, flight.from, flight.to, t)
        if (t >= 1) flight = null
      }

      const [dx, dy, dz] = sunDirectionAt(new Date())
      if (sun) sun.position.set(dx * 8, dy * 8, dz * 8)
      if (nightSunUniform) nightSunUniform.value.set(dx, dy, dz)

      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      apiRef.current = null
      window.cancelAnimationFrame(frameId)
      if (idleResume !== null) window.clearTimeout(idleResume)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      controls?.dispose()
      for (const item of disposables) item.dispose()
      renderer?.dispose()
      if (canvas.parentElement === host) host.removeChild(canvas)
    }
  }, [markers])

  useEffect(() => {
    if (!ready) return
    if (!focusSlug) {
      apiRef.current?.setHighlight(null)
      return
    }
    setPickedLabel(null)
    const marker = markersBySlug.get(focusSlug)
    if (!marker) return
    apiRef.current?.flyTo(marker)
  }, [focusSlug, ready, markersBySlug])

  useEffect(() => {
    if (!ready) return
    apiRef.current?.setGraticuleVisible(showGraticule)
  }, [showGraticule, ready])

  return (
    <div className="maps-stage">
      <div ref={hostRef} className="maps-canvas-host" />

      {!ready && !failed ? (
        <p className="maps-status" role="status">
          Loading Earth…
        </p>
      ) : null}

      {failed ? (
        <div className="maps-fallback" role="alert">
          <p>WebGL could not start on this device.</p>
          <p>
            Browse countries in{' '}
            <Link href="/explore" className="underline underline-offset-2">
              Explore
            </Link>{' '}
            instead.
          </p>
        </div>
      ) : null}

      {hover ? (
        <div
          className="maps-tooltip"
          style={{ left: hover.x, top: hover.y }}
          role="tooltip"
        >
          <span className="maps-tooltip-name">{hover.marker.name}</span>
          <span className="maps-tooltip-meta">
            {formatLatLon(hover.marker.lat, hover.marker.lon)} · {hover.marker.region}
          </span>
        </div>
      ) : null}

      {pickedLabel ? (
        <p className="maps-coords-hud" aria-live="polite">
          {pickedLabel}
        </p>
      ) : null}

      <p className="maps-credit">{MAPS_TEXTURE_CREDIT}</p>
    </div>
  )
}
