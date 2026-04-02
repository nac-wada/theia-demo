import { Transport } from "@connectrpc/connect";
import { Box, Button, InputAdornment, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export const ParameterForm = (props: { 
  transport: Transport, 
  input?: boolean,
  autoMode?: {
    enable: boolean,
    apiSetAutoMode?: (mode: boolean) => Promise<void>,
  }, 
  title: string, 
  apiSetParameter?: (value: number) => Promise<void>,
}) => {
  const [value, setValue] = useState(0);
  
  // スロットリング用のRef
  const busy = useRef(false);
  const lastSentValue = useRef(value);

  // スライダーの変更ハンドラ
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  // 数値入力の変更ハンドラ
  const handleInputChange = (event) => {
    const val = event.target.value === '' ? 0 : Number(event.target.value);
    // 0-255の範囲にクランプ
    const clamped = Math.max(0, Math.min(255, val));
    setValue(clamped);
  };

  // API実行ロジック（スロットリング）
  useEffect(() => {
    const processUpdate = async () => {
      if (busy.current || value === lastSentValue.current) return;

      busy.current = true;
      
      try {
        // await props.apiSetParameter(value);
        lastSentValue.current = value;
      } finally {
        busy.current = false;
        // 実行中に値がさらに変わっていたら再試行
        if (value !== lastSentValue.current) {
          processUpdate();
        }
      }
    };

    processUpdate();
  }, [value]);
  
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ width: 150 }}>
        <Typography variant="caption" color="textSecondary">{props.title}</Typography>
      </Box>
      <Box sx={{ width: 150 }}>
        { props.input && 
          <Slider
            value={value}
            min={0}
            max={255}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            sx={{
              width: 100,
              '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
                transition: '0.2s ease-in-out',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(63, 81, 181, 0.16)',
                },
              },
            }}
          />
        }
      </Box>
      <Box sx={{ width: 100 }}>
        {props.input &&
          <TextField
            size="small"
            value={value}
            onChange={handleInputChange}
            variant="outlined"
            inputProps={{
              step: 1,
              min: 0,
              max: 255,
              type: 'number',
              style: { textAlign: 'right', fontFamily: 'monospace' }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">μs</InputAdornment>,
            }}
            sx={{ width: 100, height: 18 }}
          />
        }
      </Box>
      <Box sx={{ width: 50, textAlign: "center" }}>
      {
        props.autoMode && 
        <Button size="small" variant={props.autoMode.enable ? "contained" : "outlined"} sx={{ width: 20, height: 20 }}>auto</Button>
      }
      </Box>
      <Box sx={{ width: 50, textAlign: "center" }}>
        <Button size="small" variant="outlined" sx={{ width: 20, height: 20 }}>default</Button>
      </Box>
    </Box>
  )
}