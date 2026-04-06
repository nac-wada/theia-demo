import { Box, Typography, Paper, IconButton, Slider, Button, Fade } from "@mui/material"
import { FOOTER_HEIGHT, HEADER_HEIGHT, TABHEADER_HEIGHT, VIDEO_MINWIDTH } from "../../App"
import { usePanelStore } from "../../../renderer/store/usePanelStore"
import { DirectionsRunOutlined, PauseOutlined, PlayArrow, ChevronLeft, ChevronRight, GridView } from "@mui/icons-material";
import { useState, useCallback, useMemo } from "react";

export const VideoView = () => {
  const [value, setValue] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const videos = useMemo(() => [
    {name: "camera#1"}, {name: "camera#2"}, {name: "camera#3"}, {name: "camera#4"},
    {name: "camera#5"}, {name: "camera#6"}, {name: "camera#7"}, {name: "camera#8"},
  ], []);

  const handleSliderChange = useCallback((_: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  }, []);

  // ナビゲーションロジック（メモ化して再レンダリング抑制）
  const navigate = useCallback((direction: 'prev' | 'next') => {
    setSelectedIdx(prev => {
      if (prev === null) return null;
      if (direction === 'prev') return prev > 0 ? prev - 1 : videos.length - 1;
      return prev < videos.length - 1 ? prev + 1 : 0;
    });
  }, [videos.length]);

  return (
    <Box 
      sx={{
        p: 1, flex: 1, height: "100%",
        minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column",
        bgcolor: 'background.paper', border: 1, borderColor: "divider", position: "relative"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.7rem", ml: 1 }}>
          {selectedIdx !== null ? `SINGLE VIEW - ${videos[selectedIdx].name}` : "MULTI VIEW"}
        </Typography>
        {selectedIdx !== null && (
          <IconButton size="small" onClick={() => setSelectedIdx(null)} sx={{ p: 0 }}>
            <GridView sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, position: "relative", overflow: "hidden", display: "flex" }}>
        {selectedIdx === null ? (
          /* --- グリッド一覧表示 --- */
          <Box 
            sx={{ 
              display: "grid", width: "100%", gap: 1, overflowY: "auto", alignContent: "start",
              gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${VIDEO_MINWIDTH}px), 1fr))`,
              '&::-webkit-scrollbar': { width: '6px', height: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' },
            }}
          >
            {videos.map(({name}, i) => (
              <Box 
                key={i} 
                onClick={() => setSelectedIdx(i)}
                sx={{ 
                  minHeight: 320, border: 1, borderColor: "divider", display: "flex", 
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'info.main' }
                }}
              >
                {name}
              </Box>
            ))}
          </Box>
        ) : (
          /* --- 単一ビデオ表示（オーバーレイ矢印付き） --- */
          <Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "black", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* ビデオ本体（仮） */}
            <Typography color="white">{videos[selectedIdx].name}</Typography>

            {/* 左矢印オーバーレイ */}
            <IconButton 
              onClick={() => navigate('prev')}
              sx={{ 
                position: "absolute", left: 0, height: "100%", width: "60px", borderRadius: 0,
                color: "white", bgcolor: "rgba(0,0,0,0)", '&:hover': { bgcolor: "rgba(255,255,255,0.1)" }
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>

            {/* 右矢印オーバーレイ */}
            <IconButton 
              onClick={() => navigate('next')}
              sx={{ 
                position: "absolute", right: 0, height: "100%", width: "60px", borderRadius: 0,
                color: "white", bgcolor: "rgba(0,0,0,0)", '&:hover': { bgcolor: "rgba(255,255,255,0.1)" }
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>

            {/* 下部インジケーター */}
            <Box sx={{ position: "absolute", bottom: 10, display: "flex", gap: 1 }}>
              {videos.map((_, i) => (
                <Box 
                  key={i}
                  sx={{ 
                    width: 6, height: 6, borderRadius: "50%", 
                    bgcolor: i === selectedIdx ? "info.main" : "rgba(255,255,255,0.3)" 
                  }} 
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* コントローラー */}
      <Paper sx={{ mt: 1, width: "100%", height: "45px", flexShrink: 0, display: "flex", alignItems: "center", p: 1, gap: 1, border: 1, borderColor: "divider" }}>
        <IconButton size="small"><PlayArrow color="info" /></IconButton>
        <IconButton size="small">
          <PauseOutlined sx={{ fontSize: 18, color: "text.secondary" }}/>
        </IconButton>
        <Box sx={{ flexGrow: 1, px: 1, display: "flex", alignItems: "center" }}>
          <Slider 
            value={value} 
            onChange={handleSliderChange} 
            sx={{ 
              color: "info.main", 
              height: 8, // (1) これでレール全体を太くします
              padding: '13px 0', // (2) デフォルトのパディングを調整して中央寄せを安定化
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                opacity: 0.5,
                backgroundColor: '#bfbfbf',
              },
              '& .MuiSlider-thumb': {
                m: 0,
                width: 10, // 太くなったレールに合わせて少し幅を調整
                height: "24px", 
                color: "white", 
                borderRadius: 0,
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit', // ホバー時の波紋を消すか調整
                },
              },
            }} 
          />
        </Box>
        <IconButton size="small"><DirectionsRunOutlined color="success" /></IconButton>
      </Paper>
    </Box>
  )
}