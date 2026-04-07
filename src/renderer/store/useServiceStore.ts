import { Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { create } from "zustand";

interface ServiceState {
  port: string;
  transport: Transport | null;
  startUpService: () => Promise<void>
}

export const useServiceStore = create<ServiceState>((set) => ({
  port: '',
  transport: null,
  startUpService: async () => {
    const port = await window.electronAPI.getStartupOutput();
    const transport = createConnectTransport({ baseUrl: `http:localhost:${port}`, defaultTimeoutMs: 30000 })
    set({ port: port, transport: transport });
  }
}))