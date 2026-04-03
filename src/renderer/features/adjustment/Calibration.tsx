import { CustomAccordion } from "./CustomAccordion"
import { Box, Typography } from "@mui/material"

export const Calibration = () => {
  return (
    <CustomAccordion title="calibration" >
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
    </CustomAccordion>
  )
}