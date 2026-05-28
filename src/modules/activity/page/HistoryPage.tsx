import Card from "../../entries/components/Card";
import "./HistoryPage.css";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  startTransition,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DatePicker } from "@mui/x-date-pickers";
import type { SelectOption } from "../../../type/DinamFormField";
import { ScannerContext } from "../../../context/ScannerContext";

import { useHistory } from "../hook/useHistory";
import { ProductItem } from "../components/ProductItem";
import CardHistory from "../components/CardHistory";
import type { EventGroupType } from "../interfaces/EventGroupType";

const INITIAL_VISIBLE_GROUPS = 8;
const VISIBLE_GROUPS_STEP = 8;

const categoryOptions: SelectOption<EventGroupType | "ALL">[] = [
  {
    label: "Entrada",
    value: "ENTRY",
  },
  {
    label: "Asignaciones",
    value: "ASSIGN",
  },
  {
    label: "Devoluciones",
    value: "RETURN",
  },
  {
    label: "Instalaciones",
    value: "INSTALL",
  },
  {
    label: "Todo",
    value: "ALL",
  },
];

export default function HistoryPage() {
  const [startDate, setStartDate] = useState<Dayjs | undefined>(
    dayjs().subtract(7, "day"),
  );
  const [endDate, setEndDate] = useState<Dayjs | undefined>(dayjs());
  const [category, setCategory] = useState<EventGroupType | "ALL">("ALL");
  const [visibleGroupCount, setVisibleGroupCount] = useState(
    INITIAL_VISIBLE_GROUPS,
  );

  const startDateParam = useMemo(
    () => startDate?.startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
    [startDate],
  );
  const endDateParam = useMemo(
    () => endDate?.endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
    [endDate],
  );
  const { groups, isLoading, isFetching } = useHistory(
    startDateParam,
    endDateParam,
  );

  const { lastScan, clearScan } = useContext(ScannerContext);

  const filteredGroups = useMemo(() => {
    if (category === "ALL") {
      return groups;
    }

    if (category === "INSTALL") {
      return groups.filter(
        (group) =>
          group.groupType === "INSTALL" || group.groupType === "INSTALLED",
      );
    }

    return groups.filter((group) => group.groupType === category);
  }, [category, groups]);

  const deferredGroups = useDeferredValue(filteredGroups);
  const visibleGroups = useMemo(
    () => deferredGroups.slice(0, visibleGroupCount),
    [deferredGroups, visibleGroupCount],
  );
  const hasMoreGroups = visibleGroupCount < deferredGroups.length;

  useEffect(() => {
    if (!lastScan) return;
    clearScan();
  }, [lastScan, clearScan]);

  useEffect(() => {
    setVisibleGroupCount(INITIAL_VISIBLE_GROUPS);
  }, [category, startDateParam, endDateParam]);

  return (
    <div className="history-container">
      <div className="history-grid">
        <div className="history-header">
          <article className="article">
            <h1>Historial</h1>
            <p>Registra los historiales de productos</p>
          </article>
        </div>
        <div className="history-section">
          <Stack gap={2}>
            <Card className="history-filters-card">
              <Stack className="history-filters-wrap">
                <Stack
                  flexDirection={"row"}
                  className="history-filters-row"
                  sx={{ width: "100%", minWidth: 0, alignItems: "stretch" }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: "1 1 0",
                      minWidth: 0,
                      gap: 1,
                    }}
                  >
                    <DatePicker
                      value={startDate}
                      maxDate={endDate}
                      onChange={(newValue) => {
                        startTransition(() => {
                          setStartDate(newValue ?? undefined);
                        });
                      }}
                      slotProps={{
                        textField: {
                          label: "Fecha inicial",
                          size: "small",
                          fullWidth: true,
                          readOnly: true,
                        },
                      }}
                    />

                    <DatePicker
                      value={endDate}
                      minDate={startDate}
                      onChange={(newValue) => {
                        startTransition(() => {
                          setEndDate(newValue ?? undefined);
                        });
                      }}
                      slotProps={{
                        textField: {
                          label: "Fecha final",
                          size: "small",
                          fullWidth: true,
                          readOnly: true,
                        },
                      }}
                    />


                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: "1 1 0",
                      minWidth: 0,
                      gap: 1,
                    }}
                  >
                    <Autocomplete<SelectOption<EventGroupType | "ALL">>
                      sx={{ width: "100%" }}
                      value={
                        categoryOptions.find((option) => option.value === category) ??
                        null
                      }
                      renderInput={(params) => (
                        <TextField {...params}
                          label="Categoria"
                          size="small"
                          fullWidth />
                      )}
                      onChange={(_, value) => {
                        const newValue = value?.value;
                        if (!newValue) return;

                        startTransition(() => {
                          setCategory(newValue);
                        });
                      }}
                      options={categoryOptions}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {(isLoading || isFetching) && deferredGroups.length === 0 && (
              <Stack
                className="history-feedback"
                direction="row"
                gap={1}
                sx={{
                  mt: "5rem",
                }}
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress size={18} />
                <Typography>Cargando historial...</Typography>
              </Stack>
            )}

            <Stack
              alignItems={"center"}
              sx={{
                gap: 2,
                width: "100%",
              }} >
              {visibleGroups.map((eventGroup) => {
                const performedBy = eventGroup.performedBySubject;

                return (
                  <CardHistory
                    key={eventGroup.groupId}
                    date={eventGroup.eventDate}
                    performedBy={performedBy.name}
                    variant={eventGroup.groupType}
                    itemCount={eventGroup.itemCount}
                    fromSubject={eventGroup.fromSubject}
                    toSubject={eventGroup.toSubject}
                  >
                    <ProductItem groups={eventGroup.itemGroups} />
                    {/* <ProductGeneric groups={eventGroup.genericGroups} /> */}
                  </CardHistory>
                );
              })}
            </Stack>

            {!isLoading && deferredGroups.length === 0 && (
              <Typography className="history-feedback" sx={{ mt: 5 }}>
                No hay movimientos para el rango seleccionado.
              </Typography>
            )}

            {hasMoreGroups && (
              <Stack alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setVisibleGroupCount(
                      (current) => current + VISIBLE_GROUPS_STEP,
                    )
                  }
                >
                  Cargar mas movimientos
                </Button>
                <Typography className="history-feedback">
                  Mostrando {visibleGroups.length} de {deferredGroups.length} grupos.
                </Typography>
              </Stack>
            )}
          </Stack>
        </div>
      </div>
    </div>
  );
}
