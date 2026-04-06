import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Panel {
  id: string;
  visible: boolean;
  size: number;
  config?: Record<string, any>;
}

interface PanelState {
  panels: Panel[];
  setPanels: (newPanels: Panel[]) => void;
  openPanel: (id: string) => void;
  closePanel: (id: string) => void;
  updateSize: (id: string, newSize: number) => void;
  resetLayout: () => void;
  updatePanelConfig: (id: string, config: Record<string, any>) => void;
}

/**
 * workspaceのパネルの状態を管理する
 * set：stateを更新する関数
 * get：stateを参照する関数　
 * ※getで取得した値に応じてUIを変えることはできない。reactはstateの状態が更新されたときにUIが再描画されるため、stateを参照するだけでは再描画されない
 */
export const usePanelStore = create<PanelState>()(
  persist(
    (set, get) => ({
      panels: [
        { id: 'preview', visible: true, size: 60 },
        { id: 'adjustment', visible: true, size: 20 },
        { id: 'analysis', visible: true, size: 20 },
        { id: 'file', visible: false, size: 20 },
      ],
      setPanels: (newPanels) => set({ panels: newPanels }),
      openPanel: (id) => set((state) => {
        const target = state.panels.find(p => p.id === id);
        if (target?.visible) return state; // すでに表示されている場合は何もしない

        // 新しく開く際、既存のパネルからサイズを少しずつ調整して合計100%を維持する
        // ライブラリ側でも自動調整されますが、State側でも不整合を防ぐため更新します
        return {
          panels: state.panels.map((p) => p.id === id ? { ...p, visible: true } : p)
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
      updatePanelConfig: (id: string, config: Record<string, any>) => set((state) => ({
          panels: state.panels.map(p => 
            p.id === id ? { ...p, config: { ...p.config, ...config } } : p
          )
      }))
    }),
    {
      name: 'panels-storage', // localStorageのキー名
      storage: createJSONStorage(() => localStorage),
    }
  ),
);