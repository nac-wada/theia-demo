import { PanelGroup, Panel } from 'react-resizable-panels';
import { Box, Paper, Typography, Divider, IconButton } from '@mui/material';
import { ResizeHandle } from './ResizeHandle';
import { usePanelStore } from '../store/usePanelStore';
import React, { useEffect, useMemo, useState } from 'react';
import { Close, ViewStreamOutlined, ViewStreamSharp, ViewStreamTwoTone } from '@mui/icons-material';
import { Panel as PanelType } from '../store/usePanelStore'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { closestCenter, defaultDropAnimationSideEffects, DndContext, DragEndEvent, DraggableAttributes, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { LiveFeed } from '../features/live/LiveFeed';
import { TABHEADER_HEIGHT } from '../App';
import { Adjustment } from '../features/adjustment/Adjustment';
import { Viewer } from '../features/3dviewer/3dViewer';
import { VideoList } from '../features/videos/VideoList';
// --- パネルレンダリングの振り分け用マップ ---
const PANEL_COMPONENTS: Record<string, React.ReactNode> = {
  adjustment: <Adjustment/>,
  preview: <LiveFeed/>,
  analysis: <Viewer/>,
  file: <VideoList/>,
};

// --- パネルヘッダーに表示するアクションボタンの定義
const PANEL_ACTIONS: Record<string, React.FC<{id: string}>> = {
  file: ({ id }) => {
    const isHorizontal = usePanelStore(state => state.panels.find(p => p.id === id)?.config?.isHorizontal);
    const updateConfig = usePanelStore(state => state.updatePanelConfig);

    return (
      <>
        <IconButton 
          title={"horizontal"}
          size="small" 
          sx={{ width: 32, borderRadius: 0 }} 
          onClick={isHorizontal ? () => {} : () => updateConfig(id, { isHorizontal: true })}
        >
          <ViewStreamOutlined sx={{ fontSize: 16, transform: "rotate(90deg)" }}/>
        </IconButton>
        <IconButton 
          title={"vertical"}
          size="small" 
          sx={{ width: 32, borderRadius: 0 }} 
          onClick={!isHorizontal ? () => {} : () => updateConfig(id, { isHorizontal: false })}
        >
          <ViewStreamOutlined sx={{ fontSize: 16 }}/>
        </IconButton>
      </>
    )
  }
}

const PanelHeader = (props: { id: string, isOverlay: boolean, attributes?: DraggableAttributes, listeners?: SyntheticListenerMap, onClose?: () => void }) => {
  const { id, attributes, listeners, isOverlay, onClose } = props
  const ActionComponent = PANEL_ACTIONS[id];

  return (
    <Box 
      sx={{ 
        height: TABHEADER_HEIGHT,
        display: 'flex', 
        alignItems: 'center', 
        p: 0.5, 
        userSelect: 'none',
        cursor: 'pointer',
        ...(isOverlay && {
          bgcolor: 'rgba(63, 81, 181, 0.2)',
          borderBottom: '1px solid #3f51b5'
        })
      }}
      {...attributes} 
      {...listeners} 
    >
      <Typography variant="caption" sx={{ flexGrow: 1, fontWeight: 'bold', color: isOverlay ? '#fff' : 'text.secondary' }}>
        {id}
      </Typography>
      {!isOverlay && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* 固有のアクションボタンを表示 */}
          {ActionComponent && <ActionComponent id={id} />}
          
          <IconButton 
            size="small" 
            sx={{ width: 32, borderRadius: 0 }} 
            onClick={onClose}
          >
            <Close sx={{ fontSize: 16 }}/>
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

const PanelFrame = (props: {index: number, panel: PanelType, isLast: boolean, onClose: () => void, onResize: (size: number) => void}) => {
  const { index, panel, isLast, onClose, onResize } = props
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: panel.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 2 : 1
  };

  return (
    <React.Fragment>
      <Panel 
        id={panel.id} 
        order={index} 
        defaultSize={panel.size} 
        minSize={15}
        onResize={onResize}
      >
        <div ref={setNodeRef} style={style}>
          <Paper square sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #333', overflow: 'hidden' }}>
            <PanelHeader 
              id={panel.id}
              attributes={attributes}
              listeners={listeners}
              onClose={onClose}    
              isOverlay={isDragging}       
            />
            <Divider />
            <Box sx={{ flexGrow: 1, p: 0.5 }}>
              {/* IDに基づいてコンテンツを切り替え。登録がない場合はデフォルトを表示 */}
              {PANEL_COMPONENTS[panel.id] || (
                <Typography variant="body2" color="text.disabled">Content for {panel.id}</Typography>
              )}
            </Box>
          </Paper>
        </div>
      </Panel>
      {!isLast && (
        <ResizeHandle />
      )}
    </React.Fragment>
  );
}

export const ResizableLayout = () => {
  const panels = usePanelStore((state) => state.panels);
  const setPanels = usePanelStore((state) => state.setPanels);
  const closePanel = usePanelStore((state) => state.closePanel);
  const updateSize = usePanelStore((state) => state.updateSize);
  const [activeId, setActiveId] = useState<any | null>(null);
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // 表示中のパネルのみ抽出
  const visiblePanels = useMemo(() => panels.filter(p => p.visible), [panels]);
  const activePanel = useMemo(() => panels.find(p => p.id === activeId), [activeId, panels]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = panels.findIndex((p) => p.id === active.id);
      const newIndex = panels.findIndex((p) => p.id === over.id);
      setPanels(arrayMove(panels, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  if (!isReady) return null;
  
  return (
    <>
    {
      visiblePanels.length > 0 && (
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 0,
            overflowX: 'auto',  // 横スクロールを許可
            display: 'flex',    // 子要素を横並びに維持
            '&::-webkit-scrollbar': { height: '8px' }, // スクロールバーを見えやすくする場合
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
          }}
        >
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={visiblePanels.map(p => p.id)} strategy={horizontalListSortingStrategy}>
              <PanelGroup direction="horizontal">
                {visiblePanels.map((panel, index) => (
                  <PanelFrame 
                    key={panel.id}
                    panel={panel}
                    index={index}
                    isLast={index === visiblePanels.length - 1}
                    onResize={(size) => updateSize(panel.id, size)}
                    onClose={() => closePanel(panel.id)}
                  />
                ))}
              </PanelGroup>
            </SortableContext>
            
            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
              {activeId && activePanel ? (
                <Paper 
                  elevation={8} 
                  sx={{ border: '1px solid', borderColor: 'primary.main', bgcolor: '#1a1a1a', width: 200, borderRadius: 1, overflow: 'hidden' }}
                >
                  <PanelHeader id={activePanel.id} isOverlay={true}/>
                </Paper>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>
      )
    }
    </>
  )
}