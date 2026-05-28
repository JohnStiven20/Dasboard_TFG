


export interface MenuItem {
  id?: number;
  icon: string,
  route: string,
  label: string,
  sortOrder: number , 
  parentId?:number , 
}

export interface MenuTree {
  id: string;
  name: string;
  description: string;
}

export type TreeMenu = MenuTree & {
  label: string;
  children?: TreeMenu[];
  disabled?: boolean;
  editable?: boolean;
};


export interface MenuItemParentDTO {
    id: number;
    label: string;
    icon: string;
    route: string;
    sortOrder: number;
}

export interface MenuItemDTO {
    id: string;
    label: string;
    route: string;
    children: MenuItemDTO[];
}
