import { Box, Typography } from "@mui/material"

export const FileList = () => {
  const list = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]

  return (
    <Box 
      sx={{
        p: 1, bgcolor: 'background.paper', border: 1, borderColor: "divider",
        width: "100%", flexShrink: 0,
        display: "flex", flexDirection: "column", overflow: "hidden", height: "100%"
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: "bold" }}>PLAY LIST</Typography>
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: "auto", 
          mt: 1, 
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' },
        }} 
      >
        <Box 
          sx={{ 
            display: "grid", 
            gap: 0.5, 
            width: "100%", 
            minWidth: "600px",
            gridTemplateColumns: "1fr", // 必要に応じて列数を指定
          }} 
        >
          {
            list.map((l, i) => (
              <Box 
                key={i}
                sx={{ 
                  border: 1, 
                  borderColor: "divider",  
                  borderRadius: 1,
                  cursor: "pointer",
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'info.main' },
                  height: "100px",
                  width: "100%",
                }}
              >
                file{i}
              </Box>
            ))
          }
        </Box>
      </Box>
    </Box>
  )
}