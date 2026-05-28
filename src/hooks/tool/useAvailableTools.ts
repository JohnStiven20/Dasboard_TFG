import { useQuery } from "@tanstack/react-query";
import { getAvailableTools } from "../../service/tool.service";

export const useAvailableTools = () => {
  const toolMut = useQuery({
    queryKey: ["tools", "available"],
    queryFn: getAvailableTools,
  });

  return {
    items: toolMut.data ?? [],
    isloading: toolMut.isLoading ,
    ispeding:toolMut.isPending
  }
};