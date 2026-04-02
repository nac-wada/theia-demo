import { ArrowDownward, ArrowDropDown, ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, InputAdornment, Paper, Slider, TextField, Typography } from "@mui/material"
import { ReactNode, useEffect } from "react"
import { useCameraStore } from "../../store/useCameraListStore"
import { FooterHeight, HeaderHeight, TabHeaderHeight } from "../../App"
import { Transport } from "@connectrpc/connect"
import { ParameterForm } from "./ParameterForm"

const AccordionComponent = (props: { title: string, children: ReactNode }) => (
  <Accordion
    defaultExpanded
    disableGutters // 1. 開いた時の上下の余白（マージン）を消す
    variant="outlined"
    sx={{
      borderColor: 'divider',
      // 2. 閉じている時の高さを制御
      minHeight: '40px', 
      '&.Mui-expanded': {
        margin: 0, // disableGuttersで消えないケースへの念押し
      },
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMore/>}
      sx={{
        minHeight: '40px', // 閉じている時の高さ
        '&.Mui-expanded': {
          minHeight: '40px', // 開いている時の高さも固定
        },
        '& .MuiAccordionSummary-content': {
          margin: '8px 0', // 中のテキストの上下余白を調整
          '&.Mui-expanded': {
            margin: '8px 0', // 開いた時もマージンを維持
          },
        },
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: "bold" }}>{props.title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 1 }}>
    {props.children}
    </AccordionDetails>
  </Accordion>
)

export const Adjustment = () => {
  const { error, isLoading, cameraList, updateCameraList } = useCameraStore();
  
  return (
    <Box 
      sx={{ 
        width: "100%",
        height: `calc(100vh - ${(HeaderHeight + FooterHeight + TabHeaderHeight + 10)}px)`, 
        overflow: "auto",
        '&::-webkit-scrollbar': { width: '6px', height: '6px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 400,
          overflow: "auto",
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
        }}
      >
        <AccordionComponent title="record" >
          <Box sx={{ px: 1 }}>
            <Typography variant="caption" color="textSecondary">SCENE_NAME</Typography>
            <Typography variant="body1" color="textSecondary"></Typography>
            <Typography variant="caption" color="textSecondary">SUBJECT_ID</Typography>
            <Typography variant="body1" color="textSecondary"></Typography>
            <Typography variant="caption" color="textSecondary">RECORDING_TIME</Typography>
            <Typography variant="body1" color="textSecondary"></Typography>
          </Box>
        </AccordionComponent>

        <AccordionComponent title="tuning" >
          <Box 
            sx={{ 
              px: 1, 
              display: "gap", 
              gap: "1px", 
              maxHeight: "500px",
              overflow: "auto",
              '&::-webkit-scrollbar': { width: '6px', height: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
            }}
          >
            <Typography variant="caption" color="textSecondary"><Checkbox size="small" sx={{ p: 0, scale: 0.8 }}/>ALL_CAMERA_TUNING</Typography>
            {
              cameraList.map(({nickname, transport}, i) => {
                return (
                  <Box 
                    key={`${nickname}_tuning`}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      p: 1
                    }}
                  >
                    <Typography variant="caption" color="textPrimary" sx={{ fontSize: 16 }}>
                      <Checkbox size="small" sx={{ p: 0, scale: 0.8 }}/>
                      {nickname}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <ParameterForm input title={"EXPOSURE"} transport={transport} autoMode={{enable: false }}/>
                      <ParameterForm input title={"GAIN"} transport={transport} autoMode={{enable: false }}/>
                      <ParameterForm input title={"GAMMA"} transport={transport}/>
                      <ParameterForm title={"WHITEBALANCE_BLUE"} transport={transport} autoMode={{enable: false }}/>
                      <ParameterForm input title={"WHITEBALANCE_BLUE"} transport={transport}/>
                      <ParameterForm input title={"WHITEBALANCE_RED"} transport={transport}/>
                    </Box>
                  </Box>
                )
              })
            }
          </Box>
        </AccordionComponent>

        <AccordionComponent title="calibration" >
          <Box 
            sx={{ 
              px: 1, 
              display: "flex",
              flexDirection: "column", 
              gap: "1px", 
              maxHeight: "500px",
              overflow: "auto",
              '&::-webkit-scrollbar': { width: '6px', height: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
            }}
          >
            <Box>
              <Typography variant="caption" color="textSecondary">CALIBRATOR_MODE</Typography>
              
            </Box>
            <Typography variant="caption" color="textSecondary">INTRINSIC</Typography>
            <Typography variant="caption" color="textSecondary">EXTRINSIC</Typography>
          </Box>
        </AccordionComponent>
      </Box>
    </Box>
  )
}