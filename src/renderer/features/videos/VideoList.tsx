import { Box } from "@mui/material"
import { FOOTER_HEIGHT, HEADER_HEIGHT, TABHEADER_HEIGHT } from "../../App"
import { usePanelStore } from "../../../renderer/store/usePanelStore"
import { VideoView } from "./VideoView";
import { FileList } from "./FileList";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const VideoList = () => {
  const isHorizontal: boolean = usePanelStore(
    (state) => state.panels.find(p => p.id ==='file')?.config?.isHorizontal
  )
  const direction = isHorizontal ? "horizontal" : "vertical"

  return (
    <Box
      sx={{
        width: "100%",
        height: `calc(100vh - ${(HEADER_HEIGHT + FOOTER_HEIGHT + TABHEADER_HEIGHT + 10)}px)`,
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap: "1px",
        overflow: "hidden",
      }}
    >
      <PanelGroup key={direction} direction={direction}>
        <Panel defaultSize={70} minSize={30}>
          {/* メインビデオエリア */}
          <VideoView/>
        </Panel>  

        {/* 境界線（リサイズハンドル） */}
        <PanelResizeHandle 
          style={{
            width: isHorizontal ? "4px" : "100%",
            height: isHorizontal ? "100%" : "4px",
            backgroundColor: "#222",
            position: 'relative', 
            outline: 'none' 
          }} 
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isHorizontal ? "2px" : "40px",
              height: isHorizontal ? "40px" : "2px",
              bgcolor: 'divider',
              borderRadius: '1px',
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'info.main' },
              '&:active': { bgcolor: 'info.main' },
            }}
          />
        </PanelResizeHandle>

        <Panel defaultSize={30} minSize={0}>
          {/* サイドパネル */}
          <FileList/>
        </Panel>  
      </PanelGroup>

    </Box>
  )
}