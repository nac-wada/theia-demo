import { Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createSoloTransportFunc, PortSolo } from "../../api/client";
import { GetDevicesResponse } from "../../gen/quartet/v1/quartet_pb";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * カメラ情報
 */
export interface CameraData {
  /**
   * rest api用transport
   * timeout設定あり(30秒)
   */
  transport: Transport;

  /**
   * streaming api用transport
   */
  streamTransport: Transport;

  /**
   * ネットワーク接続api用transport
   * timeout設定なし(60秒)
   */
  wifiTransport: Transport;

  /**
   * quartetGetDevices:Device.hostname
   */
  hostname: string;

  /**
   * quartetGetDevices:Device.interface
   */
  networkInterface: string;
  
  /**
   * quartetGetDevices:http://${Device.ipv4Addr}
   * 
   */
  ipv4Addr: string;
  
  /**
   * quartetGetDevices:Device.macAddr
   */
  macAddr: string;
  
  /**
   * quartetGetDevices:Device.nickname
   */
  nickname: string;
  
  /**
   * quartetGetDevices:Device.primary
   */
  primary: boolean;
  
  /**
   * quartetGetDevices:Device.priority
   */
  priority: number;
  
  /**
   * quartetGetDevices:Device.serialNumber
   */
  id: string;
}

interface CameraListState {
  cameraList: CameraData[];
  isLoading: boolean;
  error: string | null;
  setCameraListFromApi: (apiResponse: GetDevicesResponse | false) => void;
}

/**
 * workspaceのパネルの状態を管理する
 * set：stateを更新する関数
 * get：stateを参照する関数　
 * ※getで取得した値に応じてUIを変えることはできない。reactはstateの状態が更新されたときにUIが再描画されるため、stateを参照するだけでは再描画されない
 */
export const useCameraStore = create<CameraListState>()(
  persist(
    (set, get) => ({
      cameraList: [],
      isLoading: true,
      error: null,
      setCameraListFromApi: (apiResponse: GetDevicesResponse | false) => {
        if(!apiResponse) {
          set({ isLoading: false, error: "failed to fetch" })
          return;
        }

        const sortedDevices = apiResponse.devices.sort((a: { primary: any; serialNumber: string; }, b: { primary:any; serialNumber: any; }) => {
          if(a.primary || b.primary) {
            return a.primary ? -1 : 1;
          } else {
            return a.serialNumber.localeCompare(b.serialNumber);
          }
        })
        
        const cameras: CameraData[] = sortedDevices.map((camera, index) => {
          const soloTransport = createSoloTransportFunc({ baseUrl: `http://${camera.ipv4Addr}` })
          const wifiTransport = createConnectTransport({ baseUrl: `http://${camera.ipv4Addr}:${PortSolo}`, defaultTimeoutMs: 60000 });
          const soloStreamingTransport = createConnectTransport({ baseUrl: `http://${camera.ipv4Addr}:${PortSolo}` })
          const nickname = camera.nickname === '' ? `camera #${index + 1}`: camera.nickname
          return {
            transport: soloTransport,
            streamTransport: soloStreamingTransport,
            wifiTransport: wifiTransport,
            hostname: camera.hostname,
            networkInterface: camera.interface,
            ipv4Addr: `http://${camera.ipv4Addr}`,
            macAddr: camera.macAddr,
            nickname: nickname,
            primary: camera.primary,
            priority: camera.priority,
            id: camera.serialNumber,
          }
        })

        set({ cameraList: cameras, isLoading: false, error: null });
      },
    }),
    {
      name: 'cameraList-storage', // localStorageのキー名
      storage: createJSONStorage(() => localStorage),
    }
  ),
);