import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MainWorkspace } from './components/MainWorkspace';
import { useCameraStore } from './store/useCameraListStore';
import { useEffect } from 'react';

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
      main: '#094594',    // ナックカラー
      light: '#3a6aab'
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

export const HEADER_HEIGHT = 32
export const FOOTER_HEIGHT = 28
export const TABHEADER_HEIGHT = 32
export const LIVE_MINWIDTH = 350
export const VIDEO_MINWIDTH = 350
export const BUTTON_HEIGHT = 24; 

export default function App() {
  const { getDevices } = useCameraStore();

  useEffect(() => {
    getDevices()
  },[])

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
        <Header/>
        
        {/* --- メインレイアウトエリア（サイドメニュー + コンテンツ） --- */}
        <MainWorkspace/>

        {/* --- フッター (ステータスバー) --- */}
        <Footer/>
      </Box>
    </ThemeProvider>
  );
}