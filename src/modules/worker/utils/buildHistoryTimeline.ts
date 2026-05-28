import dayjs from "dayjs";
import type { AssignmentDataMatrixItemByWorkerDTO, AssignmentProductGenericByWorkerDTO, TimelineItemWorker } from "../../../interface/subject/assigment";

export const buildWorkerTimeline = (
    dataMatrixItems: AssignmentDataMatrixItemByWorkerDTO[],
    productGenericItems: AssignmentProductGenericByWorkerDTO[],
): TimelineItemWorker[] => {

    const productDatamatrixItems: TimelineItemWorker[] = dataMatrixItems.map(a => ({
        type: "ASSIGNMENT_DATAMATRIX",
        date: a.date,
        payload: a
    }));

    const productgeneric: TimelineItemWorker[] = productGenericItems.map((e) => ({
        type: "ASSIGNMENT_GENERIC",
        date: e.date,
        payload: e
    }))



    return [...productDatamatrixItems, ...productgeneric,]
        .sort((a, b) =>
            dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
        );
}