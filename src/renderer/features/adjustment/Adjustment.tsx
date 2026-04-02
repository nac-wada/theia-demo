import { ExpandMore, RadioButtonCheckedRounded, Stop } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, MenuItem, TextField, Typography } from "@mui/material"
import { ReactNode } from "react"
import { useCameraStore } from "../../store/useCameraListStore"
import { BUTTON_HEIGHT, FOOTER_HEIGHT, HEADER_HEIGHT, TABHEADER_HEIGHT } from "../../App"
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
      <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.7rem" }}>{props.title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 1 }}>
    {props.children}
    </AccordionDetails>
  </Accordion>
)

export const Adjustment = () => {
  const { error, isLoading, cameraList, updateCameraList } = useCameraStore();

  const dummyList = [
    { nickname: "a" },
    { nickname: "b" },
    { nickname: "c" },
    { nickname: "d" },
    { nickname: "e" },
    { nickname: "f" },
    { nickname: "g" },
    { nickname: "h" },
  ]
  
  return (
    <Box 
      sx={{ 
        width: "100%",
        height: `calc(100vh - ${(HEADER_HEIGHT + FOOTER_HEIGHT + TABHEADER_HEIGHT + 10)}px)`, 
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
          // overflow: "auto",
          // '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          // '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
        }}
      >
        <AccordionComponent title="record" >
          <Box sx={{ display: "grid", gap: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="textSecondary" sx={{ width: 130 }}>SCENE_NAME</Typography>
              <TextField
                size="small"
                variant="outlined"
                inputProps={{
                  style: { 
                    textAlign: "right", 
                    fontFamily: "monospace", 
                    fontSize: "0.75rem",
                  },
                }}
                sx={{ 
                  flexGrow: 1,
                  maxWidth: 300,
                  "& .MuiOutlinedInput-root": { height: BUTTON_HEIGHT },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="textSecondary" sx={{ width: 130 }}>SUBJECT_ID</Typography>
              <TextField
                size="small"
                variant="outlined"
                inputProps={{
                  style: { 
                    textAlign: "right", 
                    fontFamily: "monospace", 
                    fontSize: "0.75rem",
                  },
                }}
                sx={{ 
                  flexGrow: 1,
                  maxWidth: 300,
                  "& .MuiOutlinedInput-root": { height: BUTTON_HEIGHT },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="textSecondary">RECORDING_TIME</Typography>
              <TextField
                select // これでドロップダウンになります
                size="small"
                variant="outlined"
                value={"5s"} // 状態管理用の変数（例: "5s" など）
                SelectProps={{
                  // メニュー部分のスタイル微調整
                  sx: { 
                    fontSize: "0.75rem", 
                    fontFamily: "monospace",
                    textAlign: "right" 
                  }
                }}
                sx={{ 
                  width: 120, // 幅を固定するとレイアウトが安定します
                  "& .MuiOutlinedInput-root": { 
                    height: BUTTON_HEIGHT,
                    fontSize: "0.75rem"
                  },
                }}
              >
                <MenuItem sx={{ fontSize: '0.75rem' }} value="5s">5 seconds</MenuItem>
                <MenuItem sx={{ fontSize: '0.75rem' }} value="7s">7 seconds</MenuItem>
                <MenuItem sx={{ fontSize: '0.75rem' }} value="10s">10 seconds</MenuItem>
                <MenuItem sx={{ fontSize: '0.75rem' }} value="manual">manual</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"end", gap: 1 }}>
              <Box sx={{ width: 55 }}>
                <Button
                  startIcon={<RadioButtonCheckedRounded fontSize="small" sx={{ color: "red" }}/>}
                  size="small"
                  variant={"outlined"}
                  sx={{
                    width: "100%",
                    height: BUTTON_HEIGHT,
                    fontSize: "0.7rem",
                    minWidth: 0,
                    textTransform: "none",
                    px: 0,
                    color: "text.secondary",
                    borderColor: "text.secondary",
                    "&:hover": {
                      borderColor: "text.secondary", // 枠線の色を維持
                      backgroundColor: "rgba(0, 0, 0, 0.04)", // ほんのりグレーの背景を入れる場合
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: '2px', // ここを好きな値に（0にすれば密着します）
                      marginLeft: '0px',   // 左側の余白も気になるなら調整
                    }
                  }}
                >
                  REC
                </Button>
              </Box>
      
              {/* Defaultボタン */}
              <Box sx={{ width: 55 }}>
                <Button
                  startIcon={<Stop fontSize="small"/>}
                  size="small"
                  variant="outlined"
                  sx={{
                    width: "100%",
                    height: BUTTON_HEIGHT,
                    fontSize: "0.7rem",
                    minWidth: 0,
                    textTransform: "none",
                    px: 0,
                    color: "text.secondary",
                    borderColor: "text.secondary",
                    "&:hover": {
                      borderColor: "text.secondary", // 枠線の色を維持
                      backgroundColor: "rgba(0, 0, 0, 0.04)", // ほんのりグレーの背景を入れる場合
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: '2px', // ここを好きな値に（0にすれば密着します）
                      marginLeft: '0px',   // 左側の余白も気になるなら調整
                    }
                  }}
                >
                  STOP
                </Button>
              </Box>
            </Box>
          </Box>
        </AccordionComponent>

        <AccordionComponent title="tuning" >
          <Box 
            sx={{ 
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
              dummyList.map(({nickname}, i) => {
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
                      <Checkbox size="small" sx={{ p: 0, scale: 0.8 }}/>
                      {nickname}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <ParameterForm input title={"EXPOSURE"} autoMode={{enable: false }}/>
                      <ParameterForm input title={"GAIN"} autoMode={{enable: true }}/>
                      <ParameterForm input title={"GAMMA"}/>
                      <ParameterForm title={"WHITEBALANCE"} autoMode={{enable: false }} defMode={false}/>
                      <ParameterForm input title={"WHITEBALANCE_BLUE"}/>
                      <ParameterForm input title={"WHITEBALANCE_RED"}/>
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