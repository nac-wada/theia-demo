import { Box } from '@mui/material';
import { NavigationBar } from './NavigationBar';
import { ResizableLayout } from './ResizableLayout';

export const MainWorkspace = () => {

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>  
      {/* 左端サイドメニュー (Navigation Bar) */}
      <NavigationBar/>

      {/* Workspace */}
      <ResizableLayout/>
    </Box>
  )
}