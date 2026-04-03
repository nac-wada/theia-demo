import { FC, useEffect, useRef, useState } from "react"
import { soloConnectToLiveStream } from "../../../api/solo";
import { useCameraConnectionStore } from "../../store/useCameraConnectionStore";
import { Transport } from "@connectrpc/connect";
import { Box, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { LIVE_MINWIDTH } from "../../App";

export const Live: FC<{ transport: Transport, videoId: string, nickname: string }> = ({ transport, videoId, nickname }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [connectionState, setConnectionState] = useState<RTCIceConnectionState>('disconnected');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: videoId })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 2 : 1
  };
  // Storeから自分のIDの接続情報を取得
  const connection = useCameraConnectionStore((state) => state.connections[videoId]);
  const saveConnection = useCameraConnectionStore((state) => state.saveConnection);

  useEffect(() => {
    // 1. すでに接続がある場合：既存のストリームをvideoタグに割り当てて終了
    if (connection) {
      if (videoRef.current) {
        videoRef.current.srcObject = connection.stream;
        setConnectionState(connection.pc.iceConnectionState);
      }
      return; // ここで終了（新規接続を作らない）
    }

    // 2. 接続がない場合：新規にPeerConnectionを作成
    const pc = new RTCPeerConnection({});
    const ices: string[] = [];

    pc.onicecandidate = i => {
      if (i?.candidate) {
        const ice = i.candidate.toJSON();
        if (ice.candidate) ices.push(JSON.stringify(ice));
      }
    };

    pc.oniceconnectionstatechange = () => {
      setConnectionState(pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = async () => {
      if (pc.iceGatheringState === 'complete') {
        const res = await soloConnectToLiveStream({ 
          transport: transport, 
          sdp: pc.localDescription?.sdp, 
          ices: ices 
        });

        if (res) {
          try {
            await pc.setRemoteDescription({ type: 'answer', sdp: res.service?.sdp });
            res.service?.ices.forEach(i => {
              if (i) pc.addIceCandidate(JSON.parse(i));
            });
          } catch (e) {
            console.error("SDP Error:", e);
          }
        }
      }
    };

    pc.ontrack = event => {
      if (event.track.kind === "video") {
        const stream = event.streams[0];
        
        // Storeに保存（これでコンポーネントが消えても保持される）
        saveConnection(videoId, pc, stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    };

    // 再生停止防止リスナー（video要素に対して設定）
    const handlePause = () => videoRef.current?.play();
    videoRef.current?.addEventListener("pause", handlePause);

    // 初期設定・接続開始
    pc.createDataChannel("client");
    pc.addTransceiver("video");
    pc.createOffer().then(offer => pc.setLocalDescription(offer));

    return () => {
      // 3. 重要：ここでは pc.close() を呼ばない
      // パネル移動や非表示でアンマウントされても通信を継続させるため
      videoRef.current?.removeEventListener("pause", handlePause);
    };
    
    // 依存配列に connection を含めることで、保存完了後の再評価を確実にする
  }, [transport, videoId, connection, saveConnection]);

  return (
    <Box 
      ref={setNodeRef} style={style}
      sx={{ 
        width: "100%", 
        height: "100%",
        minWidth: `${LIVE_MINWIDTH}px`,
        border: 1,
        borderColor: "divider", 
        boxSizing: "border-box",
        position: "relative",
        bgcolor: "black",
        cursor: 'grab', // 掴めることを示す
        '&:active': { cursor: 'grabbing' }
      }}
      {...attributes} 
      {...listeners} 
    >
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline 
        style={{ 
          width: "100%",
          height: "100%",
          objectFit: "contain"
        }}
      />
      <Typography variant="h5" sx={{color: "#00BFFF", fontWeight: "bold", position: "absolute", bottom: 0, left: 0, m: "10px" }}>{nickname.replace("http://", '')}</Typography>
    </Box>
  );
};