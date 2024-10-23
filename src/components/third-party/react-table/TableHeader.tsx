import { Button, MenuItem, Select, Stack } from '@mui/material';
import { Table, SortingState, ColumnDef, Column } from '@tanstack/react-table';
import DebouncedInput from './DebouncedInput';
import SelectColumnSorting from './SelectColumnSorting';
import CSVExport from './CSVExport';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

interface TableHeaderProps<T extends object> {
  table: Table<T>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: boolean | undefined;
  setStatusFilter: (value: boolean | undefined) => void;
  onAdd?: () => void;
  title: string;
  data: T[];
  downSM: boolean;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  availableFilter?: boolean;
}

function TableHeader<T extends object>({
  table,
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
  onAdd,
  title,
  data,
  downSM,
  sorting,
  setSorting,
  availableFilter
}: TableHeaderProps<T>) {
  const getCSVHeaders = () => {
    return table
      .getAllColumns()
      .filter(
        (column): column is Column<T, unknown> & { columnDef: ColumnDef<T> & { accessorKey: string } } =>
          'accessorKey' in column.columnDef && typeof column.columnDef.accessorKey === 'string'
      )
      .map((column) => ({
        label: typeof column.columnDef.header === 'string' ? column.columnDef.header : '#',
        key: column.columnDef.accessorKey
      }));
  };

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ padding: 2, ...(downSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }) }}
    >
      <DebouncedInput
        value={globalFilter ?? ''}
        onFilterChange={(value) => setGlobalFilter(String(value))}
        placeholder={`Buscar ${data.length} registros...`}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
        {availableFilter && (
          <Select
            value={statusFilter ? 1 : 0}
            onChange={(event) => setStatusFilter(Number(event.target.value) === 1 ? true : false)}
            displayEmpty
            inputProps={{ 'aria-label': 'Status Filter' }}
          >
            <MenuItem value={1}>Habilitado</MenuItem>
            <MenuItem value={0}>Inhabilitado</MenuItem>
          </Select>
        )}
        <SelectColumnSorting
          getState={table.getState}
          getAllColumns={() => table.getAllColumns().filter((column) => column.getIsVisible())}
          setSorting={(value) => setSorting(typeof value === 'function' ? value(sorting) : value)}
        />
        {onAdd && (
          <Button variant="contained" onClick={onAdd} startIcon={<PlusOutlined />}>
            Agregar {title}
          </Button>
        )}
        <CSVExport
          data={
            table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0
              ? data
              : table.getSelectedRowModel().flatRows.map((row) => row.original)
          }
          headers={getCSVHeaders()}
          filename={`lista-${title.toLowerCase()}.csv`}
        />
      </Stack>
    </Stack>
  );
}

export default TableHeader;
