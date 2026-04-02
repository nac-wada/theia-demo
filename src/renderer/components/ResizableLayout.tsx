import { PanelGroup, Panel } from 'react-resizable-panels';
import { Box, Paper, Typography, Divider, IconButton } from '@mui/material';
import { ResizeHandle } from './ResizeHandle';
import { usePanelStore } from '../store/usePanelStore';
import React, { useEffect, useMemo, useState } from 'react';
import { Close } from '@mui/icons-material';
import { Panel as PanelType } from '../store/usePanelStore'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { closestCenter, defaultDropAnimationSideEffects, DndContext, DragEndEvent, DraggableAttributes, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { LiveFeed } from '../features/live/LiveFeed';
import { TABHEADER_HEIGHT } from '../App';
import { Adjustment } from '../features/adjustment/Adjustment';
import { Viewer } from '../features/3dviewer/3dViewer';
// --- パネルレンダリングの振り分け用マップ ---
const PANEL_COMPONENTS: Record<string, React.ReactNode> = {
  adjustment: <Adjustment/>,
  preview: <LiveFeed/>,
  analysis: <Viewer/>,
  file: <>file</>,
};

const PanelHeader = (props: { title: string, isOverlay: boolean, attributes?: DraggableAttributes, listeners?: SyntheticListenerMap, onClose?: () => void }) => {
  const { title, attributes, listeners, isOverlay, onClose } = props

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
        {title}
      </Typography>
      {!isOverlay && (
        <IconButton 
          size="small" 
          sx={{ width: 32, borderRadius: 0 }} 
          onClick={onClose}
        >
          <Close sx={{ fontSize: 16 }}/>
        </IconButton>
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
              title={panel.title}
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
  const { panels, setPanels, closePanel, updateSize } = usePanelStore();
  const [activeId, setActiveId] = useState(null);
  
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
        <Box sx={{ flexGrow: 1, p: 0 }}>
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
                  <PanelHeader title={activePanel.title} isOverlay={true}/>
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