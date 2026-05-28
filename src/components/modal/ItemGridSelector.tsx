import { Grid, Paper, Skeleton, Stack, Typography, Box } from "@mui/material";

interface GridSelectorProps<T> {
  title?: string;
  items: T[];
  isLoading?: boolean;
  columns?: number;
  wrapItems?: boolean;
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export default function GridSelector<T>({
  title,
  items,
  columns = 4,
  isLoading = false,
  wrapItems = true,
  renderItem,
  onSelect,
  keyExtractor,
  emptyMessage = "No hay elementos disponibles",
}: GridSelectorProps<T>) {
  const skeletons = Array.from({ length: columns * 2 });

  return (
    <Stack spacing={2}>
      {title && (
        <Typography variant="h6" fontWeight={600} sx={{ color: "#1b251e" }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={2}>
        {isLoading ? (
          skeletons.map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 12 / columns }} key={i}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid rgba(185,185,185,0.7)",
                }}
              >
                <Stack spacing={1}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </Stack>
              </Paper>
            </Grid>
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 12 / columns }}
              key={keyExtractor(item)}
            >
              {wrapItems ? (
                <Paper
                  onClick={() => onSelect?.(item)}
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid rgba(185,185,185,0.7)",
                    cursor: "pointer",
                    transition: "all .2s ease",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {renderItem(item)}
                </Paper>
              ) : (
                <Box
                  onClick={() => onSelect?.(item)}
                  sx={{
                    cursor: onSelect ? "pointer" : "default",
                  }}
                >
                  {renderItem(item)}
                </Box>
              )}
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: "1px dashed rgba(180,180,180,0.6)",
              }}
            >
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
