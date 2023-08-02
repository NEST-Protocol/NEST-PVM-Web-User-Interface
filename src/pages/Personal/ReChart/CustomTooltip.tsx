import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Stack sx={(theme) => ({
        backgroundColor: '#fff',
        color: '#000',
        padding: '8px 12px',
        borderRadius: '12px',
      })}>
        <Box sx={(theme) => ({
          fontWeight: 400,
          fontSize: '12px',
        })}>{`${label}`}</Box>
        <Box sx={(theme) => ({
          fontWeight: 700,
          fontSize: '12px',
          lineHeight: '20px',
        })}>daily : {payload[0].value !== 0 ? payload[0].value.toFixed(2) : payload[1].value.toFixed(2) } NEST</Box>
      </Stack>
    );
  }

  return null;
};