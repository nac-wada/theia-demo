import { ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import { ReactNode } from "react"

export const CustomAccordion = (props: { title: string, children: ReactNode }) => {
  return (
    <Accordion
      defaultExpanded
      disableGutters // 1. 開いた時の上下の余白（マージン）を消す
      variant="outlined"
      sx={{
        borderColor: 'divider',
        // 2. 閉じている時の高さを制御
        minHeight: '40px', 
        '&.Mui-expanded': {
          margin: 0, // disableGuttersで消えないケースへの念押し
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore/>}
        sx={{
          minHeight: '40px', // 閉じている時の高さ
          '&.Mui-expanded': {
            minHeight: '40px', // 開いている時の高さも固定
          },
          '& .MuiAccordionSummary-content': {
            margin: '8px 0', // 中のテキストの上下余白を調整
            '&.Mui-expanded': {
              margin: '8px 0', // 開いた時もマージンを維持
            },
          },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.7rem" }}>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
      {props.children}
      </AccordionDetails>
    </Accordion>
)}