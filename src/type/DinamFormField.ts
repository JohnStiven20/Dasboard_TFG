import type { UseFormSetValue, UseFormGetValues, UseFormReset } from './../../node_modules/react-hook-form/dist/types/form.d';
import type { FieldPath, FieldPathValue } from './../../node_modules/react-hook-form/dist/types/path/eager.d';
import type { FieldValues } from './../../node_modules/react-hook-form/dist/types/fields.d';
import type { GridRenderCellParams } from '@mui/x-data-grid';
import type { ReactNode } from 'react';

export type FieldValidate<T extends FieldValues, K extends FieldPath<T>> = (value: FieldPathValue<T, K>, AllValues: T) => string | undefined;

export type SelectOption<T> = {
    label: string,
    value: T
}

export type FieldOnchange< T extends FieldValues, K extends FieldPath<T>> = (value: FieldPathValue<T, K>,
    ctx: {
        setValue: UseFormSetValue<T>;
        getValues: UseFormGetValues<T>;
        resetField: (name: FieldPath<T>) => void;
    }
) => void;

export type ResponsiveGrid = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
};


export type BaseField<T extends FieldValues, K extends FieldPath<T>> = {
    key: K
    label: string,
    table?: {
        label?: string,
        width?: number,
        minWidth?: number,
        maxWidth?: number,
        minwidth?: number,
        maxwidth?: number,
        flex?: number,
        show?: boolean,
        renderCell?: (params: GridRenderCellParams<T, T, K>) => ReactNode,
        editable?: boolean
        secondValue?: number
    },
    placeholder?: string,
    helpertText?: string,
    Icon?: string,
    disabled?: boolean | ((e: T) => boolean);
    dependsOn?: FieldPath<T>[]
    grid?: ResponsiveGrid,
    visabled?: boolean
    onChange?: FieldOnchange<T, K>
    validate?: FieldValidate<T, K>,
}


export type CheckboxFieldConfig<T extends FieldValues, K extends FieldPath<T>> = BaseField<T, K> & {
    type: "checkbox",
    labelPlacement?: "end" | "start" | "top" | "bottom"
    size: "small" | "medium"
    indeterminateWhen?: (values: T) => boolean;
}

export type TextFieldConfig<T extends FieldValues, K extends FieldPath<T>> = BaseField<T, K> & {
    type: "text" | "textarea" | "numeric" | "password" | "file";
}


export type SelectFieldConfig<T extends FieldValues, K extends FieldPath<T>> = BaseField<T, K> & {
    type: "select",
    options: | SelectOption<FieldPathValue<T, K>>[] | ((values: T) => SelectOption<FieldPathValue<T, K>>[]);
    freeSolo?: boolean;
}

export type SwitchFieldConfig<TValues extends FieldValues, K extends FieldPath<TValues>> = BaseField<TValues, K> & {
    type: "switch";
};

// export type DataTimeFieldConfig<TValues extends FieldValues,K extends FieldPath<TValues>> = BaseField<TValues, K> & {
//     type: "date";
// };


export type EntitySelectFieldConfig<T extends FieldValues, K extends FieldPath<T>,R = unknown> = BaseField<T, K> & {
  type: "entity"
  mainChars?: number
  entity: string
  toOptions: (row: R) => {
    value: FieldPathValue<T, K>
    label: string
  }
  optionsEntity?:
    | SelectOption<FieldPathValue<T, K>>[]
    | ((values: T) => SelectOption<FieldPathValue<T, K>>[])
  fielName?: string
}


export type FieldConfig<TValues extends FieldValues = FieldValues> =
    | TextFieldConfig<TValues, FieldPath<TValues>>
    | SelectFieldConfig<TValues, FieldPath<TValues>>
    | SwitchFieldConfig<TValues, FieldPath<TValues>>
    | EntitySelectFieldConfig<TValues, FieldPath<TValues>, FieldPathValue<TValues , FieldPath<TValues> >>
    | CheckboxFieldConfig<TValues, FieldPath<TValues>>
    // | DataTimeFieldConfig<TValues, FieldPath<TValues>>


export type FieldConfigFor<TValues extends FieldValues,K extends FieldPath<TValues>> =
    | TextFieldConfig<TValues, K>
    | SelectFieldConfig<TValues, K>
    | SwitchFieldConfig<TValues, K>
    | EntitySelectFieldConfig<TValues, FieldPath<TValues>, unknown>
    | CheckboxFieldConfig<TValues, FieldPath<TValues>>
    // | DataTimeFieldConfig<TValues, K>;


export const makeField = <TValues extends FieldValues>() => {

    function builder<K extends FieldPath<TValues>, R>(
        f: EntitySelectFieldConfig<TValues, K, R>
    ): FieldConfig<TValues>;

    function builder<K extends FieldPath<TValues>>(
        f: FieldConfigFor<TValues, K>
    ): FieldConfig<TValues>;

    function builder(f: unknown) {
        return f as FieldConfig<TValues>;
    }

    return builder;
};

export interface GlobalFormRef<T extends FieldValues = FieldValues> {
    getValues: UseFormGetValues<T>
    setValue: UseFormSetValue<T>
    reset: UseFormReset<T>
    submit: () => void
}
