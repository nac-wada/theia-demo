import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Box } from '@mui/material'

export const Viewer = () => {
  return (
    <Box sx={{ height: '100%', bgcolor: '#0000007f' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* 明かり（全方向からの光） */}
        <ambientLight intensity={0.5} />
        {/* スポットライト（影を作る光） */}
        <pointLight position={[10, 10, 10]} />

        {/* 3Dオブジェクト（立方体） */}
        <mesh rotation={[1, 1, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* 背景の星と、マウスで回転させるコントロール */}
        <Stars />
        <OrbitControls />
      </Canvas>
    </Box>
  )
}