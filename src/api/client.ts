import { createConnectTransport } from "@connectrpc/connect-web";
import { Client, createClient, Transport } from "@connectrpc/connect";
import { DescService } from "@bufbuild/protobuf";

/**
 * apiリクエストのタイムアウト時間
 */
export const defaultTimeoutMs = 30000;
/**
 * カメラシステムのドメイン
 * - default in jetson camera (window.location.hostname)
 * - ipアドレスを指定することで、外からでもカメラを受信できる ('aireal.local')
 */
export const CameraHostname = 'aireal.local'
/**
 * quartetサービスのポート番号
 */
export const PortQuartet = '30300';
/**
 * quartetサービスのurl
 */
export const QuartetBaseUrl = `http://${CameraHostname}:${PortQuartet}`;
/**
 * quartetサービス用のtransportインスタンス
 * @param {string} baseUrl - quartetサービスのurl
 * @param {number} defaultTimeoutMs - リクエストのタイムアウト時間 
 */
export const quartetTransport = createConnectTransport({ baseUrl: QuartetBaseUrl, defaultTimeoutMs: defaultTimeoutMs })

/**
 * quartet stream系サービスのtransportインスタンス
 * @param {string} baseUrl - quartetサービスのurl
 * ※stream系のため、リクエストのタイムアウト時間を無制限にする
 */
export const quartetStreamingTransport = createConnectTransport({ baseUrl: QuartetBaseUrl })

/**
 * カメラの録画ファイルサーバーのポート番号
 */
export const PortFiles = '9090';
/**
 * soloサービスのポート番号
 */
export const PortSolo = '30200';

export function createSoloTransportFunc(props: { baseUrl: string }) {
  return createConnectTransport({ baseUrl: `${props.baseUrl}:${PortSolo}`, defaultTimeoutMs: defaultTimeoutMs })
}

export function createClientFunc<T extends DescService>(service: T, transport: Transport): Client<T>{
  return createClient(service, transport)
}