import { useEffect, useState } from "react";
import { SearchEntityService } from "../service/SearchEntityService"
import type { SelectOption } from "../type/DinamFormField";
import { useDebouncedValue } from "./useDebouncedValue";


interface useEntityOptionsProps<T> {
    entity: string;
    toOption: (options: T) => SelectOption<T>;
    search: string
}

export function useEntytyOptions<T>({ entity, toOption, search=""}: useEntityOptionsProps<T>) {

    const [options, setOoptions] = useState<SelectOption<T>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedSearch = useDebouncedValue(search, 400);


    const getOptions = async () => {
        setLoading(true);
        const rows = await SearchEntityService<T>(debouncedSearch, entity);

        const opts = rows.map((r) => { return toOption(r) });

        setOoptions(opts);
        setLoading(false);
    }


    useEffect(() => {
        getOptions();
    }, [entity, debouncedSearch]);

    return { options, loading, refresh: getOptions };
}

