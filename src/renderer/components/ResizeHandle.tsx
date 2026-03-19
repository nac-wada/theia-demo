import { PanelResizeHandle } from 'react-resizable-panels';
import { Box } from '@mui/material';

export const ResizeHandle = () => {
  return (
    <PanelResizeHandle style={{ width: '1px', position: 'relative', outline: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px',
          height: '40px',
          bgcolor: 'divider',
          borderRadius: '1px',
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: 'primary.main' },
          // ドラッグ中のハンドル視認性を上げる
          '.PanelResizeHandle[data-active] &': { bgcolor: 'primary.main', width: '2px' }
        }}
      />
    </PanelResizeHandle>
  )
};