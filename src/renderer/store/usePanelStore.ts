import { create } from 'zustand';

export interface Panel {
  id: string;
  title: string;
  visible: boolean;
  size: number;
}

interface PanelState {
  panels: Panel[];
  openPanel: (title: string) => void;
  closePanel: (id: string) => void;
  updateSize: (id: string, newSize: number) => void;
  resetLayout: () => void;
}

/**
 * workspaceのパネルの状態を管理する
 * set：stateを更新する関数
 * get：stateを参照する関数　
 * ※getで取得した値に応じてUIを変えることはできない。reactはstateの状態が更新されたときにUIが再描画されるため、stateを参照するだけでは再描画されない
 */
export const usePanelStore = create<PanelState>((set, get) => ({
  panels: [
    { id: 'left', title: 'live-stream', visible: true, size: 60 },
    { id: 'left-center', title: 'tuning', visible: true, size: 20 },
    { id: 'right-center', title: '3d-view', visible: true, size: 20 },
    { id: 'right', title: 'record', visible: false, size: 20 },
  ],
  openPanel: (title) => set((state) => {
    const target = state.panels.find(p => p.title === title);
    if (target?.visible) return state; // すでに表示されている場合は何もしない

    // 新しく開く際、既存のパネルからサイズを少しずつ調整して合計100%を維持する
    // ライブラリ側でも自動調整されますが、State側でも不整合を防ぐため更新します
    return {
      panels: state.panels.map((p) => p.title === title ? { ...p, visible: true } : p)
    };
  }),
  closePanel: (id) => set((state) => ({
    panels: state.panels.map((p) => 
      p.id === id ? { ...p, visible: false } : p
    )
  })),
  updateSize: (id, newSize) => set((state) => ({
    panels: state.panels.map((p) => 
      p.id === id ? { ...p, size: newSize } : p
    )
  })),
  resetLayout: () => set((state) => ({
    panels: state.panels.map((p) => ({ ...p, visible: true }))
  })),
}));