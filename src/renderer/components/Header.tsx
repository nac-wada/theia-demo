import { Box, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { Camera, Close, CropSquareSharp, HorizontalRuleSharp } from '@mui/icons-material';
import { HeaderHeight } from '../App';

export const Header = () => {
  const handleMinimize = () => {
    window.electronAPI.winMaximize();
  };

  const handleMaximize = () => {
    window.electronAPI.winMaximize();
  };

  const handleClose = () => {
    window.electronAPI.winClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        bgcolor: '#000000', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        // ウィンドウをドラッグ可能にする設定（Electron用）
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <Toolbar variant="dense" disableGutters sx={{ minHeight: HeaderHeight }}>
        {/* 左側：アイコンとタイトル */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, ml: 0.5 }}>
          <Camera fontSize='small'/>
          <Typography variant="caption" sx={{ fontWeight: 600, ml: 0.5, letterSpacing: 0.5, color: '#aaa' }}>
            LENSMASTER PRO
          </Typography>
        </Box>
        
        {/* 右側：ウィンドウコントロールボタン */}
        <Box sx={{ display: 'flex', height: 32, WebkitAppRegion: 'no-drag' }}>
          <IconButton 
            size="small" 
            sx={{ 
              borderRadius: 0, 
              width: 46, 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
            }}
            onClick={handleMinimize}
          >
            <HorizontalRuleSharp sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              borderRadius: 0, 
              width: 46, 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
            }}
            onClick={handleMaximize}
          >
            <CropSquareSharp sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              borderRadius: 0, 
              width: 46, 
              '&:hover': { bgcolor: '#e81123', color: 'white' } 
            }}
            onClick={handleClose}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}