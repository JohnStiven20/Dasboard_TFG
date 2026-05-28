import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
     assignmentProductGenericToWorker,
     assignmentsToWorker,
     createAssigemntWorkToConsumible,
     getAssignmentsByWorker,

} from "../service/assignment.service";
import type { AssignmentByWorkerAndDateRequest, AssignmentByWorkerRequest } from "../../../interface/subject/assigment";

export const useAssignment = () => {

     const qc = useQueryClient();


     const assigmentWorkerWithConsumiblesMut = useMutation({
          mutationFn: ({
               workerId,
               datamatrixitemids,
          }: {
               workerId: number;
               datamatrixitemids: number[];
          }) =>
               createAssigemntWorkToConsumible(workerId, datamatrixitemids),
     });



     const fetchAssignmentsByWorker = useMutation({
          mutationFn: (request: AssignmentByWorkerRequest) => assignmentsToWorker(request),
     })


     const fetchAssignmentsByWorkerAndDate = async (
          request: AssignmentByWorkerAndDateRequest
     ) => {
          return qc.fetchQuery({
               queryKey: [
                    "assignments",
                    request.workerId,
               ],
               queryFn: () =>
                    getAssignmentsByWorker(
                         request.workerId,
                    ),
          });
     };


     const assigmentWorkerWithConsumiblesGenericMut = useMutation({
          mutationFn: ({ workerId, genericProductid, amount }: { workerId: number; genericProductid: number; amount: number }) =>
               assignmentProductGenericToWorker(workerId, genericProductid, amount),
     });

     return {
          assigmentWorkerWithConsumibles:
               assigmentWorkerWithConsumiblesMut.mutateAsync,

          fetchAssignmentsByWorkerAndDate,

          assignmentProductGenericToWorker:
               assigmentWorkerWithConsumiblesGenericMut.mutateAsync,

          fetchAssignmentsByWorker: fetchAssignmentsByWorker.mutateAsync,
          isPendingAssignment: fetchAssignmentsByWorker.isPending
     };
};
