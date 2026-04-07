import { useEffect, useRef } from 'react';
import { useCameraStore } from '../store/useCameraListStore';
import { useQuartetSubscribeEventStore, useSoloSubscribeEventStore } from '../store/useSubscribeEventStore';
import { soloSubscribeEvent } from '../../api/solo';
import { quartetSubscribeEvent } from '../../api/quartet'; // Quartet用のAPI

export const StreamManager = () => {
  const cameraList = useCameraStore((state) => state.cameraList);
  const subscribeSoloServer = useSoloSubscribeEventStore((state) => state.subscribeServer);
  const subscribeQuartetServer = useQuartetSubscribeEventStore((state) => state.subscribeServer);
  
  // Solo用：IPごとに購読済みか管理
  const subscribedSoloIps = useRef<Set<string>>(new Set());
  // Quartet用：一度だけ実行するためのフラグ
  const isQuartetSubscribed = useRef(false);

  useEffect(() => {
    if (cameraList.length === 0) return;

    if (!isQuartetSubscribed.current) {
      const initQuartet = async () => {
        const stream = quartetSubscribeEvent();
        
        if (stream) {
          isQuartetSubscribed.current = true;
          console.log("Starting Quartet Stream");
          subscribeQuartetServer(stream);
        }
      };
      initQuartet();
    }

    cameraList.forEach(({ ipv4Addr, streamTransport }) => {
      if (subscribedSoloIps.current.has(ipv4Addr)) return;

      const initSolo = async () => {
        const stream = soloSubscribeEvent({ subscribeTransport: streamTransport });
        if (stream) {
          subscribedSoloIps.current.add(ipv4Addr);
          subscribeSoloServer(ipv4Addr, stream);
        }
      };
      initSolo();
    });
    
  }, [cameraList, subscribeSoloServer, subscribeQuartetServer]);

  return null;
};