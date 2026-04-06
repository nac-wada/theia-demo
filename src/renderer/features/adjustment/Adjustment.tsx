import { Box } from "@mui/material"
import { FOOTER_HEIGHT, HEADER_HEIGHT, TABHEADER_HEIGHT } from "../../App"
import { Record } from "./Record"
import { Tuning } from "./Tuning"
import { Calibration } from "./Calibration"

export const Adjustment = () => {
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
        }}
      >
        <Record/>

        <Tuning/>

        {/* <Calibration/> */}
        
      </Box>
    </Box>
  )
}