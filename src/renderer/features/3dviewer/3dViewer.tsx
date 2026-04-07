import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Box as Box, 
  Paper, 
  IconButton, 
  Typography, 
  Tooltip, 
  Fade,
  styled,
  CircularProgress,
  Divider,
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  List, 
  ChevronLeft,
  ChevronRight,
  LocationOn,
  ViewInAr,
  DeleteOutline
} from '@mui/icons-material';

// --- Types & Interfaces ---

export interface DataObject {
  id: string;
  name: string;
  type: 'calibration' | 'model';
  path: string;
  position: [number, number, number];
  timestamp?: string;
}

interface DataPointProps {
  obj: DataObject;
  showLabels: boolean;
}

// --- Styled Components ---

const DockingHandle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRight: 'none',
  borderRadius: '4px 0 0 4px',
  padding: '12px 4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 10,
  '&:hover': {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
  },
}));

// --- 3D Scene Components ---

const DataPoint: React.FC<DataPointProps> = ({ obj, showLabels }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const color = obj.type === 'calibration' ? '#f44336' : '#2196f3';

  return (
    <group position={obj.position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          {obj.type === 'calibration' ? (
            <octahedronGeometry args={[0.3, 0]} />
          ) : (
            <boxGeometry args={[0.4, 0.4, 0.4]} />
          )}
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      </Float>

      {showLabels && (
        <Html distanceFactor={10} position={[0, 0.6, 0]} center>
          <Fade in={showLabels}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 0.5, 
                whiteSpace: 'nowrap',
                bgcolor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(4px)',
                borderColor: color,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '10px' }}>
                {obj.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '8px', fontFamily: 'monospace' }}>
                {obj.position.map(p => p.toFixed(1)).join(', ')}
              </Typography>
            </Paper>
          </Fade>
        </Html>
      )}
    </group>
  );
};

const Scene: React.FC<{ objects: DataObject[]; showLabels: boolean }> = ({ objects, showLabels }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        fadeStrength={5} 
        cellSize={1} 
        sectionSize={2} 
        sectionColor="#b7b7b7" 
        cellColor="#222" 
      />

      {objects.map((obj) => (
        <DataPoint key={obj.id} obj={obj} showLabels={showLabels} />
      ))}

      <OrbitControls makeDefault minDistance={2} maxDistance={50} />
    </>
  );
};

// --- Main Viewer Component ---

export const Viewer: React.FC = () => {
  const [objects, setObjects] = useState<DataObject[]>([]);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isInspectorVisible, setIsInspectorVisible] = useState<boolean>(true);

  useEffect(() => {
    const samples: DataObject[] = [
      { id: '1', name: 'CAM_FRONT_01', type: 'calibration', path: 'C:\\Data\\calib_01.json', position: [2.0, 1.5, -3.0], timestamp: '10:30:12' },
      { id: '2', name: 'LIDAR_TOP', type: 'calibration', path: 'C:\\Data\\calib_02.json', position: [0, 2.2, 0.5], timestamp: '10:31:05' },
      { id: '3', name: 'CHASSIS_MODEL', type: 'model', path: 'C:\\Assets\\car.glb', position: [-1.5, 0, 2.0], timestamp: '10:32:00' }
    ];
    setObjects(samples);
  }, []);

  const removeObject = (id: string) => {
    setObjects(prev => prev.filter(o => o.id !== id));
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        flexGrow: 1, 
        bgcolor: '#000000', 
        overflow: 'hidden',
        border: 'divider',
        height: '100%',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene objects={objects} showLabels={showLabels} />
        </Suspense>
      </Canvas>

      <Suspense fallback={
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <CircularProgress size={24} />
        </Box>
      }>
      </Suspense>

      {/* Top Labels Toggle */}
      <Paper 
        elevation={4}
        sx={{ 
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5,
          bgcolor: 'background.paper', border: 'divider', zIndex: 5,
          borderRadius: 1
        }}
      >
        <IconButton 
          // title={showLabels ? "ラベルを非表示" : "ラベルを表示"}
          size="small" 
          onClick={() => setShowLabels(!showLabels)}
          color={showLabels ? "primary" : "default"}
        >
          {showLabels ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
        </IconButton>
        <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>
          3D LABELS
        </Typography>
      </Paper>

      {/* Data Points List (Inspector) */}
      <Fade in={isInspectorVisible}>
        <Paper 
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 300,
            bottom: 10,
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(12px)',
            border: 1,
            borderColor:"divider",
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1, fontSize: "0.7rem" }}>
              ACTIVE DATA POINTS
            </Typography>
            <IconButton size="small" onClick={() => setIsInspectorVisible(false)} sx={{ borderRadius: 0 }}>
              <ChevronRight fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'divider'}} />
          
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
            <MuiList dense disablePadding>
              {objects.map((obj) => (
                <Paper 
                  key={obj.id} 
                  variant="outlined" 
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    bgcolor: 'rgba(45, 45, 45, 0.5)', 
                    borderColor: '#444',
                    '&:hover': { borderColor: obj.type === 'calibration' ? '#f44336' : '#2196f3' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {obj.type === 'calibration' ? 
                        <LocationOn sx={{ color: '#f44336', fontSize: 14 }} /> : 
                        <ViewInAr sx={{ color: '#2196f3', fontSize: 14 }} />
                      }
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {obj.name}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => removeObject(obj.id)}>
                      <DeleteOutline sx={{ fontSize: 14, color: 'text.disabled', '&:hover': { color: '#f44336' } }} />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', fontSize: '9px', color: 'text.secondary', fontFamily: 'monospace', mt: 0.5 }}>
                    POS: [{obj.position.join(', ')}]
                  </Typography>
                </Paper>
              ))}
            </MuiList>
          </Box>
          
          <Divider sx={{ borderColor: '#444' }} />
          <Box sx={{ p: 1, bgcolor: '#222' }}>
            <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.disabled' }}>
              COUNT: {objects.length}
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Docking Handle (Closed state) */}
      {!isInspectorVisible && (
        <DockingHandle onClick={() => setIsInspectorVisible(true)}>
          <List sx={{ fontSize: 18 }} />
          <Typography 
            variant="caption" 
            sx={{ 
              writingMode: 'vertical-lr', 
              fontSize: '0.6rem', 
              fontWeight: 'black', 
              letterSpacing: 2,
              my: 1,
              color: 'text.secondary'
            }}
          >
            DATA POINTS
          </Typography>
          <ChevronLeft sx={{ fontSize: 14 }} />
        </DockingHandle>
      )}

      {/* Bottom Coordinates Help */}
      <Paper 
        variant="outlined"
        sx={{ 
          position: 'absolute', bottom: 10, left: 10, p: 1.5, 
          bgcolor: 'rgba(30,30,30,0.6)', backdropFilter: 'blur(8px)',
          borderColor: '#444', pointerEvents: 'none'
        }}
      >
        <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1, mb: 1, display: 'block' }}>
          座標系ガイド
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 2, bgcolor: '#f44336' }} />
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>X: 横方向</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 2, bgcolor: '#4caf50' }} />
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Y: 垂直方向</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 2, bgcolor: '#2196f3' }} />
            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Z: 奥行き</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
