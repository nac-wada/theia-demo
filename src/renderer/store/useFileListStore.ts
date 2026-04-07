import { Timestamp } from "@bufbuild/protobuf/wkt";
import { quartetGetRecordedKeyFileGroupsWithMetadatas } from "../../api/quartet";
import { create } from "zustand";

interface Video {
  ipv4Addr: string;
  videoId: string;
  videoSize: bigint;
  timestamp: Timestamp | null;
  sceneName: string;
  subjectId: string;
  tag: string;
  hasFrameDrops: boolean;
  hasUnstableSyncFrames: boolean;
}

interface FileItem {
  id: string,
  videos: Video[];
}

interface FileListState {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
}

export const useFileStore = create<FileListState>((set) => ({
  files: [],
  isLoading: false,
  error: null,
  fetchFiles: async () => {
    set({ isLoading: true });
    try {
      const apiResponse = await quartetGetRecordedKeyFileGroupsWithMetadatas({ order: 4, startIndex: 0, countFiles: 10 })
      if(!apiResponse) {
        set({ isLoading: false, error: "failed to fetch" })
        return;
      }
      const files: FileItem[] = await Promise.all(apiResponse.groups.map(async (group, _) => {
        const videos: Video[] = await Promise.all(group.files.map(async (file, _) => {
          return {
            ipv4Addr: file.ipv4Addr,
            videoId: file.name,
            videoSize: file.size,
            timestamp: file.createTime ?? null,
            sceneName: file.sceneName,
            subjectId: file.subjectId,
            tag: file.tag,
            hasFrameDrops: file.hasFrameDrops,
            hasUnstableSyncFrames: file.hasUnstableSyncFrames,
          }
        }))

        return {
          id: group.key,
          videos: videos
        }
      }))

      console.log(files)

      set({ files: [...files], isLoading: false});
    } catch (e) {
      set({ isLoading: false, error: `${e}` })
    }
  }
}));