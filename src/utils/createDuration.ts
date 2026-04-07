import { Duration } from "@bufbuild/protobuf/wkt";

export const createDuration = (settingTimeMs: number): Duration => {
  const seconds = Math.trunc(settingTimeMs / 1000);
  const nanos = (settingTimeMs % 1000) * 1e6;

  return {
    $typeName: "google.protobuf.Duration",
    seconds: BigInt(seconds),
    nanos: nanos
  };
};