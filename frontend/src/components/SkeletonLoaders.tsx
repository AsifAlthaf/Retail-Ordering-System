import { Box, Paper, Skeleton, Stack } from "@mui/material";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          height={60}
          variant="rounded"
          sx={{ borderRadius: 1 }}
        />
      ))}
    </Stack>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
        gap: 2,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Paper key={i} sx={{ p: 2, borderRadius: 1 }}>
          <Skeleton height={140} variant="rounded" sx={{ mb: 2 }} />
          <Skeleton height={20} width="80%" sx={{ mb: 1 }} />
          <Skeleton height={24} width="40%" sx={{ mb: 2 }} />
          <Skeleton height={32} variant="rounded" />
        </Paper>
      ))}
    </Box>
  );
}
