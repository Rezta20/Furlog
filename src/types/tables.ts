export interface ITableColumns {
  name: string;
  label: string;
  field: string | ((row: string) => string);
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface ITableProps<T> {
  rows: T[];
  columns: ITableColumns[];
  rowKey: string;
}
