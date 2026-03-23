import { Error, Info, Refresh } from '@mui/icons-material';
import { Box, Typography, Divider, Stack, Button } from '@mui/material';
import { useCameraStore } from '../store/useCameraListStore';


export const Footer = () => {
  const { error, getDevices } = useCameraStore()
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        height: 28, 
        bgcolor: 'background.paper', 
        borderTop: '1px solid', 
        borderColor: 'divider', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        px: 1.5,
        fontSize: '0.7rem',
        zIndex: (theme) => theme.zIndex.drawer + 2
      }}
    >
      <Stack direction="row" spacing={2} sx={{ width: '100%' }} alignItems="center">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Info sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>システム稼働中</Typography>
        </Stack>
        
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 0.5 }} />
        
        {
          error &&
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Error color='error' sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              {error}
              <Button variant='outlined' color='primary' onClick={() => getDevices()}><Refresh/></Button>
            </Typography>
          </Stack>
        }

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
          CPU: 12% | RAM: 1.4GB | UTF-8
        </Typography>
      </Stack>
    </Box>
  )
}