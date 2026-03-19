import { Refresh } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useCameraStore } from "../../store/useCameraListStore"
import { useEffect } from "react";
import { quartetGetDevices } from "../../../api/quartet";

export const LiveFeed = () => {
  const { error, isLoading, cameraList, setCameraListFromApi } = useCameraStore();

  useEffect(() => {
    const fetchData = async () => {
      setCameraListFromApi(await quartetGetDevices())
    }

    fetchData();
  },[])

  return (
    <Box 
      sx={{ 
        height: "100vh",
        overflow: "auto",
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
      }}
    >
    {
      isLoading ? <Typography color="textDisabled">connecting camera system...</Typography> :
      error ? <Typography color="textDisabled">{error}<Button size="small" color="primary"><Refresh fontSize="small" sx={{ fontSize: 20 }}/></Button></Typography> :
      <Box 
        sx={{ 
          height: "100%",
          width: "100%", 
          display: "grid", 
          gridTemplateColumns: `repeat(auto-fit, minmax(600px, 1fr))`, 
        }}
      >
      {
        cameraList.map((camera, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: "100%", 
              minWidth: "600px",
              aspectRatio: 1936/1216, 
              borderColor: "primary.main", 
              border: 1
            }}
          >
          {camera.ipv4Addr}
          </Box>
        ))
      }
      </Box>
    }
    </Box>
  )
}