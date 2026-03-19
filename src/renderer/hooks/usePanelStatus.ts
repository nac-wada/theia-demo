import { usePanelStore } from '../store/usePanelStore';

export const usePanelStatus = (title: string) => {
  const visible = usePanelStore((state) => 
    state.panels.find(p => p.title === title)?.visible
  );
  
  // 他のロジック（例：パネルが開いている時だけ特定のスタイルを返すなど）
  return visible
};