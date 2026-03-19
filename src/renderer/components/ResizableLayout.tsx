import { PanelGroup, Panel } from 'react-resizable-panels';
import { Box, Paper, Typography, Divider, IconButton } from '@mui/material';
import { ResizeHandle } from './ResizeHandle';
import { usePanelStore } from '../store/usePanelStore';
import React, { useMemo } from 'react';
import { Close } from '@mui/icons-material';
import { Panel as PanelType } from '../store/usePanelStore'

const PanelFrame = (props: {panel: PanelType, onClose: () => void}) => {
  const { panel, onClose } = props

  return (
    <Paper square sx={{ height: '100%', p: 0.5, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>{panel.title}</Typography>
        <IconButton size="small" onClick={onClose} sx={{ width: 32, borderRadius: 0 }}>
          <Close sx={{ fontSize: 16 }}/>
        </IconButton>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="text.secondary">{panel.id.toUpperCase()} CONTENT</Typography>
      </Box>
    </Paper>
  )
}

export const ResizableLayout = () => {
  const panels = usePanelStore((state) => state.panels);
  const closePanel = usePanelStore((state) => state.closePanel);
  const updateSize = usePanelStore((state) => state.updateSize);

  // 表示中のパネルのみ抽出
  const visiblePanels = useMemo(() => panels.filter(p => p.visible), [panels]);
  
  /**
   * パネル構成が変わるたびに計算をリセットするためのキー (バグ防止)
   * IDのリストをキーにすることで、構成が変わった瞬間にコンポーネントを再生成し、
   * 不正な比率（合計が100%にならない状態）での描画を回避します。
   */
  const groupKey = useMemo(() => visiblePanels.map(p => p.id).join('-'), [visiblePanels]);

  console.log(panels)

  return (
    <>
    {
      visiblePanels.length > 0 && (
        visiblePanels.length === 1 ?
        <Box sx={{ flexGrow: 1, p: 0.5 }}>
          <PanelFrame panel={visiblePanels[0]} onClose={() => closePanel(visiblePanels[0].id)}/>
        </Box> :
        <PanelGroup 
          direction="horizontal" 
          key={groupKey} // パネル増減時に強制再マウント
          id="main-group"
        >
          {visiblePanels.map((panel, index) => (
            <React.Fragment key={panel.id}>
              <Panel 
                id={panel.id}
                order={index}
                // リサイズ後の保存サイズを適用。不整合時はライブラリが100%に補正します。
                defaultSize={panel.size} 
                minSize={10} 
                onResize={(size) => updateSize(panel.id, size)}
              >
                <Box sx={{ height: '100%', p: 0.2 }}>
                  <PanelFrame 
                    panel={panel} 
                    onClose={() => closePanel(panel.id)} 
                  />
                </Box>
              </Panel>
              {index < visiblePanels.length - 1 && <ResizeHandle />}
            </React.Fragment>
          ))}
        </PanelGroup>
      )
    }
    </>
  )
}