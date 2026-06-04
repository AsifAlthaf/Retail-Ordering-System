import { Box, Skeleton, Stack } from '@mui/material';

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  hasActions?: boolean;
}

export function SkeletonTable({ rows = 5, cols = 4, hasActions = true }: SkeletonTableProps) {
  return (
    <Box sx={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols + (hasActions ? 1 : 0)}, 1fr)`,
          gap: 2,
          px: 2,
          py: 1.5,
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {Array.from({ length: cols + (hasActions ? 1 : 0) }).map((_, i) => (
          <Skeleton key={i} height={14} variant="text" sx={{ borderRadius: 1 }} />
        ))}
      </Box>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Box
          key={rowIdx}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols + (hasActions ? 1 : 0)}, 1fr)`,
            gap: 2,
            px: 2,
            py: 1.75,
            borderBottom: rowIdx < rows - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              height={colIdx === 0 ? 22 : 16}
              width={colIdx === 0 ? '60%' : `${60 + (colIdx * 15) % 30}%`}
              variant="rounded"
            />
          ))}
          {hasActions && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Skeleton width={28} height={28} variant="rounded" />
              <Skeleton width={28} height={28} variant="rounded" />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

interface SkeletonCardsProps {
  count?: number;
  columns?: number;
}

export function SkeletonCards({ count = 6, columns = 3 }: SkeletonCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 2,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
            background: '#111827',
            p: 0,
          }}
        >
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 0 }} />
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Skeleton height={18} width="75%" variant="rounded" />
              <Skeleton height={14} width="50%" variant="rounded" />
              <Skeleton height={24} width="40%" variant="rounded" />
              <Skeleton height={36} variant="rounded" sx={{ mt: 0.5 }} />
            </Stack>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

interface SkeletonStatProps {
  count?: number;
}

export function SkeletonStats({ count = 4 }: SkeletonStatProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ p: 2.5, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', background: '#111827' }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Stack spacing={1} flex={1}>
                <Skeleton height={12} width="60%" variant="rounded" />
                <Skeleton height={32} width="70%" variant="rounded" />
                <Skeleton height={11} width="50%" variant="rounded" />
              </Stack>
              <Skeleton width={44} height={44} variant="rounded" sx={{ borderRadius: '10px' }} />
            </Box>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
