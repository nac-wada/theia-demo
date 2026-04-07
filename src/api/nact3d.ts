import { Transport } from "@connectrpc/connect";
import { createClientFunc } from "./client";
import { T3DService } from "src/gen/nact3dcore/v1/nact3dcore_pb";

export async function nact3dSayHello(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).sayHello({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: SayHello")
    return false
  }
}

export async function nact3dGetBuildInfo(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).getBuildInfo({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: GetBuildInfo")
    return false
  }
}

export async function nact3dGetTMBatchInfo(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).getTMBatchInfo({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: GetTMBatchInfo")
    return false
  }
}

export async function nact3dGetTMBatchStatus(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).getTMBatchStatus({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: GetTMBatchStatus")
    return false
  }
}

export async function nact3dRunTMBatch(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).runTMBatch({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: RunTMBatch")
    return false
  }
}

export async function nact3dCancelTMBatch(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).cancelTMBatch({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: CancelTMBatch")
    return false
  }
}

export async function nact3dSetTMBatchInfo(props: { transport: Transport }) {
  try {
    const res = await createClientFunc(T3DService, props.transport).setTMBatchInfo({});

    if(!res) {
      return false
    }

    return res
  } catch (e) {
    console.error("api request failed: SetTMBatchInfo")
    return false
  }
}