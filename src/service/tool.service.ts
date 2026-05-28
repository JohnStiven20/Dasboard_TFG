import { http } from "../api/http";
import type { Tool } from "../interface/tools/tools.interface";


export const getAvailableTools = async () => {
  const { data } = await http.get<Tool[]>(`/api/tools/available`);
  return data;
};