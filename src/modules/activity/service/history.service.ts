import { http } from "../../../api/http";
import type { HistoryEventGroupDTO } from "../interfaces/HistoryEventGroupDTO";

export const getHistoryAll = async (
    startDate?: string,
    endDate?: string,
): Promise<HistoryEventGroupDTO[]> => {
    const { data } = await http.get<HistoryEventGroupDTO[]>(
        "/api/movement/history",
        {
            params: { startDate, endDate },
        },
    );
    return data;
};
