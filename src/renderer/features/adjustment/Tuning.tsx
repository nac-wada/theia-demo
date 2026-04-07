import { Box, Checkbox, Typography } from "@mui/material"
import { useCameraStore } from "../../store/useCameraListStore"
import { ParameterForm } from "./ParameterForm"
import { CustomAccordion } from "./CustomAccordion"

export const Tuning = () => {
  const cameraList = useCameraStore((state) => state.cameraList);

  return (
    <CustomAccordion title="tuning" >
      <Box 
        sx={{ 
          maxHeight: "500px",
          overflow: "auto",
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
        }}
      >
        <Typography variant="caption" color="textSecondary"><Checkbox color={"info"} size="small" sx={{ p: 0, scale: 0.8 }}/>ALL_CAMERA_TUNING</Typography>
        {
          cameraList.map(({nickname, ipv4Addr}) => {
            return (
              <Box 
                key={`${nickname}_tuning`}
                sx={{
                  minWidth: 400,
                  border: 1,
                  borderColor: 'divider',
                  p: 1
                }}
              >
                <Typography variant="caption" color="textPrimary" sx={{ fontSize: 16 }}>
                  <Checkbox color={"info"} size="small" sx={{ p: 0, scale: 0.8 }}/>
                  {nickname}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <ParameterForm ipv4Addr={ipv4Addr} input title={"EXPOSURE"} autoMode={{enable: false }}/>
                  <ParameterForm ipv4Addr={ipv4Addr} input title={"GAIN"} autoMode={{enable: true }}/>
                  <ParameterForm ipv4Addr={ipv4Addr} input title={"GAMMA"}/>
                  <ParameterForm ipv4Addr={ipv4Addr} title={"WHITEBALANCE"} autoMode={{enable: false }} defMode={false}/>
                  <ParameterForm ipv4Addr={ipv4Addr} input title={"WHITEBALANCE BLUE"}/>
                  <ParameterForm ipv4Addr={ipv4Addr} input title={"WHITEBALANCE RED"}/>
                </Box>
              </Box>
            )
          })
        }
      </Box>
    </CustomAccordion>
  )
}