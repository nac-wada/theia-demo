import { Transport } from "@connectrpc/connect";
import { Box, Button, InputAdornment, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BUTTON_HEIGHT } from "../../../renderer/App";
import { useSoloSubscribeEventStore } from "../../../renderer/store/useSubscribeEventStore";
import { EventType } from "../../../gen/solo/v1/solo_pb";

export const ParameterForm = (props: {
  ipv4Addr: string;
  transport?: Transport;
  input?: boolean;
  autoMode?: {
    enable: boolean;
    apiSetAutoMode?: (mode: boolean) => Promise<void>;
  };
  defMode?: boolean,
  title: string;
  apiSetParameter?: (value: number) => Promise<void>;
}) => {
  const { defMode = true, ipv4Addr } = props;
  const latest = useSoloSubscribeEventStore((state) => {
    const events = state.serverEvents[ipv4Addr]?.[EventType.IMAGE_EXPOSURE_CHANGED];
    if (!events || events.length === 0) return null;
    return events[events.length - 1]; // 最新の1件
  });

  const [value, setValue] = useState(0);
  const busy = useRef(false);
  const lastSentValue = useRef(value);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value === "" ? 0 : Number(event.target.value);
    const clamped = Math.max(0, Math.min(255, val));
    setValue(clamped);
  };

  useEffect(() => {
    const processUpdate = async () => {
      if (busy.current || value === lastSentValue.current) return;
      busy.current = true;
      try {
        if (props.apiSetParameter) await props.apiSetParameter(value);
        lastSentValue.current = value;
      } finally {
        busy.current = false;
        if (value !== lastSentValue.current) {
          processUpdate();
        }
      }
    };
    processUpdate();
  }, [value, props.apiSetParameter]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // space-between をやめて左詰めにし、gapで制御
        justifyContent: "flex-start", 
        py: 0.5,
      }}
    >
      {/* 左側：タイトルエリア (幅をさらに狭める、またはautoにする) */}
      <Box sx={{ width: 130, flexShrink: 0 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ 
            fontWeight: "bold", 
            display: "block", 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap",
            fontSize: "0.7rem",
          }}
        >
          {props.title}
        </Typography>
      </Box>

      {/* 右側：コントロールグループ全体を flexGrow で広げる */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 0.5, // 各要素間の隙間
        flexGrow: 1, // これでタイトル横から右端までを埋める
        justifyContent: "end"
      }}>
        
        {/* スライダーエリア：ここが伸縮してタイトルとの隙間を埋める */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          {props.input && (
            <Slider
              value={value}
              min={0}
              max={255}
              onChange={handleSliderChange}
              size="small"
              sx={{
                minWidth: 45, maxWidth: 300,
                mr: 1,
                color: "info.main",
                '& .MuiSlider-rail': {
                  opacity: 0.5,
                  backgroundColor: '#bfbfbf',
                },
                '& .MuiSlider-thumb': { m: 0, width: 4, height: 12, color: "white", borderRadius: 0 },
              }}
            />
          )}
        </Box>

        {/* 数値入力エリア (以降は幅固定) */}
        <Box sx={{ width: 90, flexShrink: 0 }}>
          {props.input && (
            <TextField
              size="small"
              value={value}
              onChange={handleInputChange}
              variant="outlined"
              inputProps={{
                step: 1, min: 0, max: 9000, type: "number",
                style: { 
                  textAlign: "right", 
                  fontFamily: "monospace", 
                  fontSize: "0.75rem",
                },
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end" sx={{ '& p': { fontSize: '0.6rem' } }}>μs</InputAdornment>,
              }}
              sx={{ 
                "& .MuiOutlinedInput-root": { height: BUTTON_HEIGHT },
              }}
            />
          )}
        </Box>

        {/* Autoボタン */}
        <Box sx={{ width: 35, flexShrink: 0 }}>
          {props.autoMode && (
            <Button
              size="small"
              color={"info"}
              variant={props.autoMode.enable ? "contained" : "outlined"}
              sx={{
                width: "100%", height: BUTTON_HEIGHT, fontSize: "0.7rem",
                minWidth: 0, textTransform: "none", px: 0,
                color: props.autoMode.enable ? "white":"text.secondary", borderColor: "divider",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Auto
            </Button>
          )}
        </Box>

        {/* Defaultボタン */}
        <Box sx={{ width: 35, flexShrink: 0 }}>
          {defMode && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              sx={{
                width: "100%", height: BUTTON_HEIGHT, fontSize: "0.7rem",
                minWidth: 0, textTransform: "none", px: 0,
                color: "text.secondary", borderColor: "divider",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              Def
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};