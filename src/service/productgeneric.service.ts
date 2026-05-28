import { http } from "../api/http";
import type { GenericProductBasicDTO } from "../interface/subject/assigment";

export const getProductGenericAvailable = async () => {
  const { data } = await http.get<GenericProductBasicDTO[]>(
    `/api/product/generic/available`
  );
  return data;
};