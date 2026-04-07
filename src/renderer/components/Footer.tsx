import { Error, NotificationsNoneOutlined, Refresh } from '@mui/icons-material';
import { Box, Typography, Stack, Button, IconButton, Badge } from '@mui/material';
import { useCameraStore } from '../store/useCameraListStore';


export const Footer = () => {
  const error = useCameraStore((state) => state.error)
  const getDevices = useCameraStore((state) => state.getDevices)
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        height: 28, 
        bgcolor: 'primary.main', 
        borderTop: '1px solid', 
        borderColor: 'divider', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center',
        px: 1, 
        fontSize: '0.7rem',
        zIndex: (theme) => theme.zIndex.drawer + 2
      }}
    >
      <Stack direction="row" spacing={2} sx={{ width: '100%' }} alignItems="center">
        {/* <Stack direction="row" spacing={0.5} alignItems="center">
          <Info sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>システム稼働中</Typography>
        </Stack> */}
        
        {/* <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 0.5 }} /> */}
        
        {
          error &&
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Error color='error' sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              {error}
              <Button color='inherit' sx={{ width: 20, height: 20 }} onClick={() => getDevices()}><Refresh sx={{ fontSize: 20 }}/></Button>
            </Typography>
          </Stack>
        }

        <Box sx={{ flexGrow: 1 }} />

        <IconButton size={"small"} sx={{ borderRadius: 0 }}>
          <Badge color={"info"} variant="dot">
            <NotificationsNoneOutlined sx={{ fontSize: 18 }}/>
          </Badge>
        </IconButton>
      </Stack>
    </Box>
  )
}