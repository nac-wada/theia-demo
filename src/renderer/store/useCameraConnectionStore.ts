import { create } from 'zustand';

interface ConnectionData {
  pc: RTCPeerConnection;
  stream: MediaStream;
}

interface CameraConnectionState {
  // キーは ipv4Addr や cameraID などのユニークな文字列
  connections: Record<string, ConnectionData>;
  
  // 接続の追加・更新
  saveConnection: (id: string, pc: RTCPeerConnection, stream: MediaStream) => void;
  
  // 個別削除（パネルを完全に閉じた時用）
  removeConnection: (id: string) => void;
  
  // 全削除（ログアウト時など）
  clearAll: () => void;
}

export const useCameraConnectionStore = create<CameraConnectionState>((set) => ({
  connections: {},

  saveConnection: (id, pc, stream) => 
    set((state) => ({
      connections: {
        ...state.connections,
        [id]: { pc, stream }
      }
    })),

  removeConnection: (id) => 
    set((state) => {
      const conn = state.connections[id];
      if (conn) {
        conn.pc.close(); // 通信を遮断
      }
      const newConnections = { ...state.connections };
      delete newConnections[id];
      return { connections: newConnections };
    }),

  clearAll: () => 
    set((state) => {
      Object.values(state.connections).forEach(c => c.pc.close());
      return { connections: {} };
    })
}));