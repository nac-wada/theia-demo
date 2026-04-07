import { Box, Typography } from "@mui/material";
import { useCameraStore } from "../../store/useCameraListStore"
import { FOOTER_HEIGHT, HEADER_HEIGHT, LIVE_MINWIDTH, TABHEADER_HEIGHT } from "../../App";
import { Live } from "./Live";
import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export const LiveFeed = () => {
  const error = useCameraStore((state) => state.error);
  const isLoading = useCameraStore((state) => state.isLoading);
  const cameraList = useCameraStore((state) => state.cameraList);
  const updateCameraList = useCameraStore((state) => state.updateCameraList);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cameraList.findIndex((p) => p.ipv4Addr === active.id);
      const newIndex = cameraList.findIndex((p) => p.ipv4Addr === over.id);
      updateCameraList(arrayMove(cameraList, oldIndex, newIndex));
    }
    // setActiveId(null);
  };

  return (
    <Box 
      sx={{ 
        height: `calc(100vh - ${(HEADER_HEIGHT + FOOTER_HEIGHT + TABHEADER_HEIGHT + 10)}px)`, 
        display: "flex", 
        flexDirection: "column",
        overflow: "auto",
        '&::-webkit-scrollbar': { width: '6px', height: '6px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
      }}
    >
    {
      isLoading ? <Typography color="textDisabled">connecting camera system...</Typography> :
      error ? 
      <Typography color="textDisabled">
        {error}
      </Typography> :
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        // onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cameraList.map(c => c.ipv4Addr)} strategy={horizontalListSortingStrategy}>
          <Box 
            sx={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(auto-fit, minmax(${LIVE_MINWIDTH}px, 1fr))`, 
              width: "100%",
              height: "100%",
              pb: 2,
              gap: 1
            }}
          >
          {
            cameraList.map((camera, index) => (
              <Live key={camera.ipv4Addr} transport={camera.transport} videoId={camera.ipv4Addr} nickname={camera.nickname} />
            ))
          }
          </Box>
        </SortableContext>
      </DndContext>
    }
    </Box>
  )
}