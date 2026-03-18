import { Group, Panel, Separator } from 'react-resizable-panels';
import { Box, Paper, Typography, Divider, createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Tooltip, Stack } from '@mui/material';
import { Analytics, Camera, Close, CropSquare, CropSquareSharp, FolderOpen, HelpOutline, History, HorizontalRuleSharp, Info, Maximize, Minimize, Settings, Storage } from '@mui/icons-material';

// 1. ダークモード用のテーマ設定
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0a0a', // ウィンドウ全体の背景
      paper: '#121212',   // パネルの背景
    },
    divider: '#333333',   // 境界線の色
    primary: {
      main: '#3f51b5',    // アクセントカラー
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

// リサイズ境界線（スプリッター）のカスタムスタイル
const ResizeHandle = () => (
  <Separator style={{ width: '8px', position: 'relative', outline: 'none' }}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '2px',
        height: '40px',
        bgcolor: 'divider',
        borderRadius: '1px',
        transition: 'background-color 0.2s',
        '&:hover': { bgcolor: 'primary.main' },
        // ドラッグ中のハンドル視認性を上げる
        '.PanelResizeHandle[data-active] &': { bgcolor: 'primary.main', width: '4px' }
      }}
    />
  </Separator>
);

export default function App() {

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* デフォルトのCSSをリセット */}
      <Box sx={{ 
        height: '100%', 
        width: '100%', 
        bgcolor: 'background.default', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' 
      }}>
        {/* --- カスタムタイトルバー --- */}
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
          <Toolbar variant="dense" disableGutters sx={{ minHeight: 32 }}>
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
        
        {/* --- メインレイアウトエリア（サイドメニュー + コンテンツ） --- */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          
          {/* 左端サイドメニュー (Navigation Bar) */}
          <Box sx={{ 
            width: 48, 
            bgcolor: '#000000', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            py: 1,
            gap: 1,
            borderRight: '1px solid',
            borderColor: 'divider'
          }}>
            <IconButton title="カメラ設定" size="small" sx={{ color: 'primary.main' }}><Camera sx={{fontSize: 20}}/></IconButton>
            
            <IconButton title="解析データ" size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#fff' } }}><Analytics sx={{fontSize: 20}}/></IconButton>
            
            <IconButton title="ファイル" size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#fff' } }}><FolderOpen sx={{fontSize: 20}}/></IconButton>
            
            <IconButton title="履歴" size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#fff' } }}><History sx={{fontSize: 20}}/></IconButton>
            
            <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <IconButton title="ヘルプ" size="small" sx={{ color: 'text.secondary' }}><HelpOutline sx={{fontSize: 20}}/></IconButton>
              <IconButton title="設定" size="small" sx={{ color: 'text.secondary' }}><Settings sx={{fontSize: 20}}/></IconButton>
            </Box>
          </Box>

          {/* PanelGroupに修正（react-resizable-panelsの標準仕様） */}
          <Group orientation="horizontal" id="main-group">
            
            {/* 左側：調整パネル */}
            <Panel id="left-panel">
              <Paper 
                square 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  p: 2, 
                  borderRight: '1px solid', 
                  borderColor: 'divider', 
                  overflow: 'auto',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  CAMERA CONTROLS
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>調整パネル</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  <p>カメラ設定項目...</p>
                  {/* ここにスライダーなどを配置 */}
                </Box>
              </Paper>
            </Panel>

            <ResizeHandle />

            {/* 中央：ライブビュー */}
            <Panel id="center-panel">
              <Box sx={{ 
                height: '100%', 
                bgcolor: '#000', // 映像エリアは完全な黒
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                position: 'relative'
              }}>
                <Box sx={{ 
                  border: '1px dashed #333', 
                  width: '80%', 
                  height: '60%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  borderRadius: 1
                }}>
                  <Typography color="grey.800" variant="h5">LIVE VIDEO FEED</Typography>
                </Box>
                
                {/* ステータス情報オーバーレイ */}
                <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                  <Typography variant="caption" sx={{ bgcolor: 'rgba(0,0,0,0.6)', p: 0.5, borderRadius: 0.5 }}>
                    STREAMING: ON
                  </Typography>
                </Box>
                
                <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                  <Typography variant="caption" color="grey.600">1920x1080 | 60fps</Typography>
                </Box>
              </Box>
            </Panel>

            <ResizeHandle />

            {/* 右側：解析結果 */}
            <Panel id="right-panel">
              <Paper 
                square 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  p: 2, 
                  borderLeft: '1px solid', 
                  borderColor: 'divider', 
                  overflow: 'auto',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  DATA ANALYSIS
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>解析結果</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  <p>キャリブレーションデータ...</p>
                </Box>
              </Paper>
            </Panel>
          </Group>
        </Box>

        {/* --- フッター (ステータスバー) --- */}
        <Box 
          component="footer" 
          sx={{ 
            height: "28px", 
            bgcolor: 'background.paper', 
            borderTop: '1px solid', 
            borderColor: 'divider', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            px: 1.5,
            fontSize: '0.7rem',
            zIndex: (theme) => theme.zIndex.drawer + 2
          }}
        >
          <Stack direction="row" spacing={2} sx={{ width: '100%' }} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Info sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>システム稼働中</Typography>
            </Stack>
            
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 0.5 }} />
            
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Storage sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Disk: 42.1 GB free</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
              CPU: 12% | RAM: 1.4GB | UTF-8
            </Typography>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}