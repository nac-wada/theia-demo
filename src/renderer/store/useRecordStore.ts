import { quartetStartRecorderWithDuration } from "../../api/quartet";
import { createDuration } from "../../utils/createDuration";
import { create } from "zustand";

interface RecordState {
  isRecording: boolean;
  elapsedTime: number;
  timerId: NodeJS.Timeout | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetTimer: () => void;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  isRecording: false,
  elapsedTime: 0,
  timerId: null,

  startRecording: async () => {
    const duration = createDuration(10000)
    const key = "theia-batch"
    const fileName = "${key}-${uuid}-${timestamp}${ext}";
    const success = await quartetStartRecorderWithDuration({ key, fileName, duration });
    if (success) {
      // 既存のタイマーがあればクリア
      if (get().timerId) clearInterval(get().timerId!);

      // 1秒ごとに elapsedTime をインクリメントするタイマーを開始
      const id = setInterval(async () => {
        const nextTime = get().elapsedTime + 1;
        
        // 指定の時間に達したかチェック
        if (nextTime >= 10) {
          // 指定時間に達したら停止処理を呼ぶ
          await get().stopRecording();
        } else {
          set({ elapsedTime: nextTime });
        }
      }, 1000);

      set({ isRecording: true, timerId: id, elapsedTime: 0 });
    }
  },

  stopRecording: async () => {
    const { timerId } = get();
    if (timerId) {
      clearInterval(timerId);
    }

    // 状態を更新
    set({ 
      isRecording: false, 
      timerId: null 
    });
  },

  resetTimer: () => {
    set({ elapsedTime: 0 });
  }
}));