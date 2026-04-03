import { Box, Typography, Paper, IconButton, Slider } from "@mui/material"
import { FOOTER_HEIGHT, HEADER_HEIGHT, TABHEADER_HEIGHT, VIDEO_MINWIDTH } from "../../App"
import { usePanelStore } from "../../../renderer/store/usePanelStore"
import { DirectionsRunOutlined, PauseOutlined, PlayArrow } from "@mui/icons-material";
import { useState } from "react";

export const VideoList = () => {
  const [value, setValue] = useState(0);
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  // filePanelの特定のプロパティ(size)だけを監視するようにセレクタを工夫
  // これにより、sizeが変わった時だけ再レンダリングされる
  const fileSize = usePanelStore((state) => state.panels.find(p => p.id === 'file')?.size ?? 0);

  // 条件判定
  const isHorizontal = fileSize >= 50;

  const videos = [
    {name: "camera#1"},
    {name: "camera#2"},
    {name: "camera#3"},
    {name: "camera#4"},
    {name: "camera#5"},
    {name: "camera#6"},
    {name: "camera#7"},
    {name: "camera#8"},
  ]

  return (
    <Box
      sx={{
        width: "100%",
        height: `calc(100vh - ${(HEADER_HEIGHT + FOOTER_HEIGHT + TABHEADER_HEIGHT + 10)}px)`,
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap: "1px",
        overflow: "hidden", // 親自体はスクロールさせず、子に任せる
      }}
    >
      {/* 1つ目のBox (メイン) */}
      <Box 
        sx={{
          p: 1, 
          width: "100%", 
          border: 1, 
          bgcolor: 'background.paper',
          borderColor: "divider",
          minWidth: isHorizontal ? `${VIDEO_MINWIDTH}px` : "100%",
          // ポイント1: Flexアイテムとして縮小可能にする
          ...(isHorizontal ? { flex: 1, minWidth: 0 } : { height: "60%", minHeight: 0 }),
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.7rem", ml: 1, flexShrink: 0 }}>
          videos
        </Typography>

        {/* ポイント2: ビデオの表示エリアだけを独立してスクロールさせる */}
        <Box 
          sx={{ 
            display: "grid",
            justifyContent: "center", 
            alignContent: "start", // 上詰めで配置
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${VIDEO_MINWIDTH}px), 1fr))`,
            width: "100%",
            gap: 1,
            flexGrow: 1, 
            overflowY: "auto", // ここでスクロール！
            my: 1, // 上下の余白
            '&::-webkit-scrollbar': { width: '6px', height: '6px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' },
          }}
        >
          {videos.map(({name}, i) => (
            <Box key={i} sx={{ minWidth: VIDEO_MINWIDTH, width: "100%", height: "100%", border: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {name}
            </Box>
          ))}
        </Box>

        {/* controllerのBox (一番下に固定) */}
        <Paper sx={{ width: "100%", height: "45px", flexShrink: 0, border: 1, borderColor: "divider", borderRadius: 2, display: "flex", flexDirection: "row", alignItems: "center", p: 1, gap: 1 }}>
          <IconButton sx={{ borderRadius: 0, width: "25px", height: "100%", border: 2, borderColor: "info.main" }}>
            <PlayArrow color={"info"} sx={{ fontSize: 18 }}/>
          </IconButton>
          
          <IconButton sx={{ borderRadius: 0, width: "25px", height: "100%", border: 2, borderColor: "text.secondary" }}>
            <PauseOutlined sx={{ fontSize: 18, color: "text.secondary" }}/>
          </IconButton>

          <Box 
            sx={{ 
              flexGrow: 1, 
              px: 2, // 左右の余白を少し広げるとバランスが良くなります
              display: "flex", 
              alignItems: "center" // 垂直方向の中央揃えを保証
            }}
          >
            <Slider
              value={value}
              min={0}
              max={255}
              onChange={handleSliderChange}
              // size="small" は削除するか、カスタムスタイルで上書きします
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

          <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.8rem", ml: 1, whiteSpace: "nowrap", flexShrink: 0 }}>0.00.00 / 0.00.00</Typography>

          <IconButton sx={{ borderRadius: 0, width: "25px", height: "100%", border: 2, borderColor: "success.main" }}>
            <DirectionsRunOutlined sx={{ fontSize: 18, color: "success.main" }}/>
          </IconButton>
        </Paper>
      </Box>

      {/* 2つ目のBox (サイド) */}
      <Box 
        sx={{
          p: 1, 
          width: isHorizontal ? "30%" : "100%",
          minWidth: isHorizontal ? "300px" : "100%",
          // ポイント3: 横並び時でも縦並び時でも「余った分だけ」表示してスクロール
          flex: isHorizontal ? "0 0 300px" : 1, 
          minHeight: 0, // Flexの子要素が中身より小さくなることを許可する
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Typographyを固定してリストだけスクロールさせたい場合
          bgcolor: 'background.paper',
          border: 1,
          borderColor: "divider"
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.7rem", ml: 1, flexShrink: 0 }}>
          playlist
        </Typography>
        <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1, '&::-webkit-scrollbar': { width: '6px' } }}>
          {/* プレイリストの中身がここに入ると想定 */}
        </Box>
      </Box>
    </Box>
  )
}