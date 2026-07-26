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
  Mesh,
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

import {
  latLonToVector3,
  worldMarkers,
  type WorldMarker,
} from '~/lib/world/markers'
import { WORLD_TEXTURE_CREDIT, WORLD_TEXTURES } from '~/lib/world/textures'

const EARTH_RADIUS = 1
const CLOUD_RADIUS = 1.01
const ATMOSPHERE_RADIUS = 1.045
const MARKER_RADIUS = 1.018
const SUN_DIRECTION = new Vector3(1.2, 0.35, 0.55).normalize()

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
  marker: WorldMarker
  x: number
  y: number
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

function createMarkerPoints(markers: WorldMarker[]) {
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

export function EarthGlobe() {
  const hostRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const markers = useRef(worldMarkers()).current
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [hover, setHover] = useState<HoverState | null>(null)
  const [selected, setSelected] = useState<WorldMarker | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let frameId = 0
    let renderer: WebGLRenderer | undefined
    let controls: OrbitControls | undefined
    let earth: Mesh | undefined
    let clouds: Mesh | undefined
    let night: Mesh | undefined
    let atmosphere: Mesh | undefined
    let markersPoints: Points | undefined
    const disposables: Array<{ dispose: () => void }> = []

    const scene = new Scene()
    scene.background = new Color('#03060d')

    const camera = new PerspectiveCamera(
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
    renderer.domElement.className = 'world-canvas'
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
    const sun = new DirectionalLight(0xfff2d6, 2.35)
    sun.position.copy(SUN_DIRECTION.clone().multiplyScalar(8))
    scene.add(ambient, sun)

    const stars = createStarfield()
    scene.add(stars)
    disposables.push(stars.geometry, stars.material as PointsMaterial)

    const root = new Group()
    scene.add(root)

    const sphere = new SphereGeometry(EARTH_RADIUS, 96, 96)
    disposables.push(sphere)

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
    // Points need a generous threshold in world units at our scale.
    raycaster.params.Points = { threshold: 0.035 }

    let pointerDown = { x: 0, y: 0, t: 0 }
    let idleResume: number | null = null

    const pauseAutoRotate = () => {
      if (!controls) return
      controls.autoRotate = false
      if (idleResume !== null) window.clearTimeout(idleResume)
      idleResume = window.setTimeout(() => {
        if (!controls || prefersReducedMotion()) return
        controls.autoRotate = true
      }, 4500)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!renderer || !markersPoints) return
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
      if (!renderer || !markersPoints) return
      if (renderer) renderer.domElement.style.cursor = 'grab'
      const moved =
        Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 6
      const elapsed = performance.now() - pointerDown.t
      if (moved || elapsed > 700) return

      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(markersPoints, false)
      if (hits[0]?.index != null) {
        setSelected(markers[hits[0].index])
      }
    }

    const onWheel = () => pauseAutoRotate()

    const onResize = () => {
      if (!renderer || !host) return
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
            loadTexture(WORLD_TEXTURES.day),
            loadTexture(WORLD_TEXTURES.night),
            loadTexture(WORLD_TEXTURES.clouds),
            loadTexture(WORLD_TEXTURES.normal),
            loadTexture(WORLD_TEXTURES.specular),
          ])

        if (disposed) {
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
        earth = new Mesh(sphere, earthMaterial)
        root.add(earth)
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
        // Hide city lights on the sunlit hemisphere via onBeforeCompile.
        nightMaterial.onBeforeCompile = (shader) => {
          shader.uniforms.uSunDirection = { value: SUN_DIRECTION.clone() }
          shader.vertexShader = shader.vertexShader
            .replace(
              '#include <common>',
              `#include <common>
               varying vec3 vWorldNormal;`,
            )
            .replace(
              '#include <beginnormal_vertex>',
              `#include <beginnormal_vertex>
               vWorldNormal = normalize(mat3(modelMatrix) * objectNormal);`,
            )
          shader.fragmentShader = shader.fragmentShader
            .replace(
              '#include <common>',
              `#include <common>
               uniform vec3 uSunDirection;
               varying vec3 vWorldNormal;`,
            )
            .replace(
              '#include <dithering_fragment>',
              `float nightFactor = 1.0 - smoothstep(-0.05, 0.18, dot(normalize(vWorldNormal), normalize(uSunDirection)));
               gl_FragColor.rgb *= nightFactor;
               gl_FragColor.a *= nightFactor;
               #include <dithering_fragment>`,
            )
        }
        night = new Mesh(sphere, nightMaterial)
        night.material.polygonOffset = true
        night.material.polygonOffsetFactor = -1
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
        clouds = new Mesh(new SphereGeometry(CLOUD_RADIUS, 96, 96), cloudMaterial)
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
        atmosphere = new Mesh(
          new SphereGeometry(ATMOSPHERE_RADIUS, 64, 64),
          atmosphereMaterial,
        )
        root.add(atmosphere)
        disposables.push(atmosphere.geometry, atmosphereMaterial)

        markersPoints = createMarkerPoints(markers)
        root.add(markersPoints)
        disposables.push(
          markersPoints.geometry,
          markersPoints.material as PointsMaterial,
        )

        // Start over the Atlantic looking toward Europe / Africa — a familiar
        // “blue marble” framing rather than a random pole.
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
      if (disposed || !renderer || !controls) return
      frameId = window.requestAnimationFrame(tick)
      if (clouds) clouds.rotation.y += 0.00035
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
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

  return (
    <div className="world-stage">
      <div ref={hostRef} className="world-canvas-host" />

      {!ready && !failed ? (
        <p className="world-status" role="status">
          Loading Earth…
        </p>
      ) : null}

      {failed ? (
        <div className="world-fallback" role="alert">
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
          ref={tooltipRef}
          className="world-tooltip"
          style={{ left: hover.x, top: hover.y }}
          role="tooltip"
        >
          <span className="world-tooltip-name">{hover.marker.name}</span>
          <span className="world-tooltip-meta">{hover.marker.region}</span>
        </div>
      ) : null}

      {selected ? (
        <div className="world-selection" role="dialog" aria-label={selected.name}>
          <div className="world-selection-copy">
            <p className="world-selection-code">{selected.code}</p>
            <h2 className="world-selection-name">{selected.name}</h2>
            <p className="world-selection-meta">
              {selected.subregion} · {selected.region}
            </p>
          </div>
          <div className="world-selection-actions">
            <Link href={`/explore/${selected.slug}`} className="world-selection-link">
              Open field guide
            </Link>
            <button
              type="button"
              className="world-selection-dismiss"
              onClick={() => setSelected(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <p className="world-credit">{WORLD_TEXTURE_CREDIT}</p>
    </div>
  )
}
