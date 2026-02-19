import { useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import useStore from '../store'
import { generateTubularHandle } from '../utils/tubularHandleGenerator'

function HandleScene() {
  const strokes = useStore(s => s.strokes)
  const smoothLevel = useStore(s => s.smoothLevel)
  const cupHeightMm = useStore(s => s.cupHeightMm)
  const cupTopDiameterMm = useStore(s => s.cupTopDiameterMm)
  const cupBottomDiameterMm = useStore(s => s.cupBottomDiameterMm)
  const filledWeightG = useStore(s => s.filledWeightG)
  const targetSafetyFactor = useStore(s => s.targetSafetyFactor)

  const lastStroke = strokes.length > 0 ? strokes[strokes.length - 1] : null

  const result = useMemo(() => {
    if (!lastStroke || lastStroke.length < 2) return null
    try {
      return generateTubularHandle(lastStroke, {
        cupHeightMm,
        cupTopDiameterMm,
        cupBottomDiameterMm,
        filledWeightG,
        targetSafetyFactor,
        smoothLevel,
      })
    } catch (e) {
      console.warn('Handle generation failed:', e.message)
      return null
    }
  }, [lastStroke, cupHeightMm, cupTopDiameterMm, cupBottomDiameterMm,
      filledWeightG, targetSafetyFactor, smoothLevel])

  useEffect(() => {
    if (result?.group) {
      const meshes = []
      result.group.traverse(child => {
        if (child.isMesh) meshes.push(child)
      })
      window.__handleMeshes = meshes
      window.__strengthReport = result.strengthReport
    } else {
      window.__handleMeshes = []
      window.__strengthReport = null
    }
    return () => {
      window.__handleMeshes = []
      window.__strengthReport = null
    }
  }, [result])

  if (!result) {
    return (
      <Html center>
        <div style={{ color: '#aaa', fontSize: 14, textAlign: 'center', userSelect: 'none' }}>
          Draw a handle curve on the photo<br />to generate a 3D handle
        </div>
      </Html>
    )
  }

  return <primitive object={result.group} />
}

export default function Preview3D() {
  return (
    <Canvas camera={{ position: [0, 0, 200], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 80, 60]} intensity={1} />
      <HandleScene />
      <OrbitControls makeDefault />
      <gridHelper args={[400, 40, '#ddd', '#eee']} rotation={[Math.PI / 2, 0, 0]} />
    </Canvas>
  )
}
