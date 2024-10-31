import { Theme } from '@mui/material';
import { Chip, Tooltip, Stack, Box, SxProps } from '@mui/material';

interface ChipItem {
  id: string | number;
  name: string | number;
}

interface ChipGroupProps<T extends ChipItem> {
  items: T[];
  maxChips?: number;
  sx?: SxProps<Theme>;
}

const ChipGroup = <T extends ChipItem>({ items, maxChips = 2, sx }: ChipGroupProps<T>) => {
  const visibleChips = items.slice(0, maxChips);
  const remainingCount = items.length - maxChips;
  const hasMoreChips = remainingCount > 0;

  return (
    <Stack direction="row" spacing={1} sx={sx}>
      {visibleChips.map((item) => (
        <Chip
          key={item.id}
          label={item.name}
          size="small"
          sx={{
            backgroundColor: '#EDF2F7',
            color: '#2D3748',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#E2E8F0'
            },
            height: '24px',
            fontSize: '0.75rem'
          }}
        />
      ))}

      {hasMoreChips && (
        <Tooltip
          title={
            <Box sx={{ p: 1 }}>
              {items.slice(maxChips).map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    py: 0.5,
                    color: '#2D3748',
                    fontSize: '0.75rem'
                  }}
                >
                  {item.name}
                </Box>
              ))}
            </Box>
          }
          arrow
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                borderRadius: '6px',
                minWidth: '120px'
              },
              '& .MuiTooltip-arrow': {
                color: 'white'
              }
            }
          }}
        >
          <Chip
            label={`+${remainingCount}`}
            size="small"
            sx={{
              backgroundColor: '#EDF2F7',
              color: '#2D3748',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#E2E8F0'
              },
              height: '24px',
              fontSize: '0.75rem'
            }}
          />
        </Tooltip>
      )}
    </Stack>
  );
};

export default ChipGroup;
