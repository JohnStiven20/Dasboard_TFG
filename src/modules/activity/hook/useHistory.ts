import { useQuery } from "@tanstack/react-query";
import type { HistoryEventGroupView } from "../interfaces/HistoryEventGroupView";
import { ResourceType } from "../interfaces/HistoryEventType";
import type { HistoryEventGroupDTO } from "../interfaces/HistoryEventGroupDTO";
import type { ProductGenericHistoryEventDTO } from "../interfaces/ProductGenericHistoryEventDTO";
import type { ProductItemHistoryEventDTO } from "../interfaces/ProductItemHistoryEventDTO";
import { getHistoryAll } from "../service/history.service";

const buildHistoryView = (
  groups: HistoryEventGroupDTO[],
): HistoryEventGroupView[] => {
  return groups.map((group) => {
    const itemGroups = new Map<string, HistoryEventGroupView["itemGroups"][number]>();
    const genericGroups = new Map<
      string,
      HistoryEventGroupView["genericGroups"][number]
    >();
    let itemCount = 0;

    group.events.forEach((event) => {
      if (event.resourceType === ResourceType.ITEM) {
        const item = event as ProductItemHistoryEventDTO;
        let productGroup = itemGroups.get(item.productName);

        if (!productGroup) {
          productGroup = {
            productName: item.productName,
            total: 0,
            codes: [],
          };
          itemGroups.set(item.productName, productGroup);
        }

        productGroup.total += 1;
        itemCount += 1;

        const codeStr = item.productIdentifierCode || "Sin código";

        let codeGroup = productGroup.codes.find(
          (groupByCode) => groupByCode.code === codeStr,
        );

        if (!codeGroup) {
          codeGroup = {
            code: codeStr,
            items: [],
          };
          productGroup.codes.push(codeGroup);
        }

        codeGroup.items.push(item);
        return;
      }

      if (event.resourceType === ResourceType.GENERIC) {
        const generic = event as ProductGenericHistoryEventDTO;
        let productGroup = genericGroups.get(generic.productName);

        if (!productGroup) {
          productGroup = {
            productName: generic.productName,
            quantity: 0,
            codes: [],
          };
          genericGroups.set(generic.productName, productGroup);
        }

        productGroup.quantity += generic.quantity;
        itemCount += generic.quantity;

        const codeStr = generic.productIdentifierCode || "Sin código";

        let codeGroup = productGroup.codes.find(
          (groupByCode) => groupByCode.code === codeStr,
        );

        if (!codeGroup) {
          codeGroup = {
            code: codeStr,
            quantity: 0,
            items: [],
          };
          productGroup.codes.push(codeGroup);
        }

        codeGroup.quantity += generic.quantity;
        codeGroup.items.push(generic);
        return;
      }

      itemCount += 1;
    });

    return {
      groupId: group.groupId,
      groupType: group.groupType,
      performedBySubject: group.performedBySubject,
      fromSubject: group.fromSubject,
      toSubject: group.toSubject,
      eventDate: group.eventDate,
      itemCount,
      itemGroups: Array.from(itemGroups.values()),
      genericGroups: Array.from(genericGroups.values()),
    };
  });
};

export const useHistory = (startDate?: string, endDate?: string) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["history-event-groups", startDate, endDate],
    queryFn: () => getHistoryAll(startDate, endDate),
    select: buildHistoryView,
  });

  return {
    groups: data ?? [],
    isLoading,
    isFetching,
  };
};
