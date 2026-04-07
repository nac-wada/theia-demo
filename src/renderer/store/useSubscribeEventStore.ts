import { SubscribeEventResponse as QuartetSubscribeEvent } from "src/gen/quartet/v1/quartet_pb";
import { SubscribeEventResponse as SoloSubscribeEvent } from "src/gen/solo/v1/solo_pb";
import { create } from "zustand";

interface SoloSubscribeEventState {
  serverEvents: Record<string, Record<string, SoloSubscribeEvent[]>>;
  subscribeServer: (ipv4Addr: string, stream: AsyncIterable<SoloSubscribeEvent>) => Promise<void>;
}

export const useSoloSubscribeEventStore = create<SoloSubscribeEventState>((set) => ({
  serverEvents: {},
  subscribeServer: async(ipv4Addr, stream) => {
    for await (const data of stream) {
      const eventKey = data.type
      set((state) => {
        const serverData = state.serverEvents[ipv4Addr] || {};
        const currentHistory = serverData[eventKey] || [];

        return {
          serverEvents: {
            ...state.serverEvents,
            [ipv4Addr]: {
              ...serverData,
              [eventKey]: [...currentHistory, data].slice(-100)
            }
          }
        }
      })
    }
  }
}))

interface QuartetSubscribeEventState {
  events: Record<number, QuartetSubscribeEvent[]>;
  subscribeServer: (stream: AsyncIterable<QuartetSubscribeEvent>) => Promise<void>;
}

export const useQuartetSubscribeEventStore = create<QuartetSubscribeEventState>((set) => ({
  events: {},
  subscribeServer: async(stream) => {
    for await (const data of stream) {
      set((state) => {
        const eventType = data.type;
        const currentHistory = state.events[eventType] || [];

        return {
          events: {
            ...state.events,
            [eventType]: [...currentHistory, data].slice(-100)
          }
        }
      })
    }
  }
}))