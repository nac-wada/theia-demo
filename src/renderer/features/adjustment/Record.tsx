import { RadioButtonCheckedRounded, Stop } from "@mui/icons-material"
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material"
import { BUTTON_HEIGHT } from "../../App"
import { CustomAccordion } from "./CustomAccordion"

export const Record = () => {
  return (
    <CustomAccordion title="record" >
      <Box 
        sx={{ 
          display: "grid", 
          gap: 1,
          maxHeight: "500px",
          overflow: "auto",
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 1, }}>
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
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
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
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
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
                borderColor: "divider",
                "&:hover": {
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
                borderColor: "divider",
                "&:hover": {
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
    </CustomAccordion>
  )
}