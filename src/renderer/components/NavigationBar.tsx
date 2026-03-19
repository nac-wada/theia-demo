import { Box, IconButton } from '@mui/material';
import { Analytics, AnalyticsOutlined, AnalyticsSharp, Camera, FolderOpen, FolderOpenSharp, HelpOutline, Settings, Title, TuneSharp, VideocamOffOutlined, VideocamOutlined, VideoLibraryOutlined, ViewInArOutlined } from '@mui/icons-material';
import { usePanelStore } from '../store/usePanelStore';
import { usePanelStatus } from '../hooks/usePanelStatus';

const NavButton = (props: { title: string, icon: React.ReactNode }) => {
  const openPanel = usePanelStore((state) => state.openPanel);
  const isVisible = usePanelStatus(props.title)

  return (
      <IconButton 
        title={props.title} 
        size="medium" 
        sx={{ 
          borderRadius: 0, 
          width: 48, 
          color: 'text.secondary', 
          '&:hover': { color: '#fff' }, 
          ...(isVisible && { 
            borderLeft: 2, 
            borderColor: "primary.main" 
          }) 
        }} 
        onClick={() => openPanel(props.title)}
      >
        {props.icon}
      </IconButton>
  )
}

export const NavigationBar = () => {

  return (
    <Box sx={{ 
      width: 48, 
      bgcolor: '#000000', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      py: 1,
      gap: 1,
      borderRight: '1px solid',
      borderColor: 'divider'
    }}>

      <NavButton title='live-stream' icon={<VideocamOutlined sx={{fontSize: 20}}/>}/>
      <NavButton title='tuning' icon={<TuneSharp sx={{fontSize: 20}}/>}/>
      <NavButton title='3d-view' icon={<ViewInArOutlined sx={{fontSize: 20}}/>}/>
      <NavButton title='record' icon={<VideoLibraryOutlined sx={{fontSize: 20}}/>}/>
      
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <IconButton title="ヘルプ" size="small" sx={{ color: 'text.secondary' }}><HelpOutline sx={{fontSize: 20}}/></IconButton>
        <IconButton title="設定" size="small" sx={{ color: 'text.secondary' }}><Settings sx={{fontSize: 20}}/></IconButton>
      </Box>
    </Box>
  )   
}