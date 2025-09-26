// Column type for table
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export interface GlobalTableProps<RowType extends { _id: string }> {
  columns: Column<RowType>[];
  data: RowType[];
  onEdit?: (row: RowType) => void;
  onDelete?: (row: RowType) => void;
  title?: string;
}