import { Fragment, useMemo, useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
  FilterFn,
  Row
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import ScrollX from '../../../../components/ScrollX';
import MainCard from '../../../../components/MainCard';
import { LabelKeyObject } from 'react-csv/lib/core';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import DebouncedInput from '../../../../components/third-party/react-table/DebouncedInput';
import SelectColumnSorting from '../../../../components/third-party/react-table/SelectColumnSorting';
import CSVExport from '../../../../components/third-party/react-table/CSVExport';
import RowSelection from '../../../../components/third-party/react-table/RowSelection';
import HeaderSort from '../../../../components/third-party/react-table/HeaderSort';
import TablePagination from '../../../../components/third-party/react-table/TablePagination';
import { IWarehouse } from '../../../../types/catalog/warehouse';
import EmptyTable from '../../../../components/third-party/react-table/EmptyTable';

export const fuzzyFilter: FilterFn<IWarehouse> = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

interface Props {
  data: IWarehouse[];
  columns: ColumnDef<IWarehouse>[];
  modalToggler: () => void;
}

interface WarehouseTableHeaderProps {
  table: ReturnType<typeof useReactTable<IWarehouse>>;
  data: IWarehouse[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: boolean | undefined;
  setStatusFilter: (value: boolean | undefined) => void;
  modalToggler: () => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
}

// ==============================|| WAREHOUSE TABLE HEADER ||============================== //

const WarehouseTableHeader: React.FC<WarehouseTableHeaderProps> = ({
  table,
  data,
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
  modalToggler,
  sorting,
  setSorting
}) => {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().forEach((column) => {
    const columnDef = column.columnDef;
    if ('accessorKey' in columnDef && typeof columnDef.accessorKey === 'string') {
      headers.push({
        label: typeof columnDef.header === 'string' ? columnDef.header : '#',
        key: columnDef.accessorKey
      });
    }
  });

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
        <Select
          value={statusFilter ? 1 : 0}
          onChange={(event) => setStatusFilter(Number(event.target.value) === 1 ? true : false)}
          displayEmpty
          inputProps={{ 'aria-label': 'Status Filter' }}
        >
          <MenuItem value={1}>Habilitado</MenuItem>
          <MenuItem value={0}>Inhabilitado</MenuItem>
        </Select>
        <SelectColumnSorting
          {...{
            getState: table.getState,
            getAllColumns: () => table.getAllColumns().filter((column) => column.getIsVisible()),
            setSorting: (value) => setSorting(typeof value === 'function' ? value(sorting) : value)
          }}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
            Agregar Almacen
          </Button>
          <CSVExport
            {...{
              data:
                table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0
                  ? data
                  : table.getSelectedRowModel().flatRows.map((row) => row.original),
              headers,
              filename: 'lista-almacenes.csv'
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

interface WarehouseTableBodyProps {
  table: ReturnType<typeof useReactTable<IWarehouse>>;
}

// ==============================|| WAREHOUSE TABLE BODY ||============================== //

const WarehouseTableBody: React.FC<WarehouseTableBodyProps> = ({ table }) => {
  const theme = useTheme();
  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<IWarehouse>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (!header.column.getIsVisible()) return null;

                if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                  Object.assign(header.column.columnDef.meta, {
                    className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                  });
                }

                return (
                  <TableCell
                    key={header.id}
                    {...header.column.columnDef.meta}
                    onClick={header.column.getToggleSortingHandler()}
                    {...(header.column.getCanSort() &&
                      header.column.columnDef.meta === undefined && {
                        className: 'cursor-pointer prevent-select'
                      })}
                  >
                    {header.isPlaceholder ? null : (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                        {header.column.getCanSort() && <HeaderSort column={header.column} />}
                      </Stack>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => <WarehouseTableRow key={row.id} row={row} backColor={backColor} />)
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length}>
                <EmptyTable msg="No hay datos para mostrar" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface WarehouseTableRowProps {
  row: Row<IWarehouse>;
  backColor: string;
}

// ==============================|| WAREHOUSE TABLE ROW ||============================== //

const WarehouseTableRow: React.FC<WarehouseTableRowProps> = ({ row, backColor }) => (
  <Fragment>
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
    {row.getIsExpanded() && (
      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
        <TableCell colSpan={row.getVisibleCells().length}>{/* <ExpandingUserDetail data={row.original} /> */}</TableCell>
      </TableRow>
    )}
  </Fragment>
);

// ==============================|| WAREHOUSE TABLE - MAIN COMPONENT ||============================== //

const WarehouseTable: React.FC<Props> = ({ data, columns, modalToggler }) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(true);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((customer) => customer.habilitado === statusFilter);
  }, [statusFilter, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      columnVisibility: { id: false }
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  return (
    <MainCard content={false}>
      <WarehouseTableHeader
        table={table}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setSorting={setSorting}
        modalToggler={modalToggler}
        sorting={sorting}
      />
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <WarehouseTableBody table={table} />
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
};

export default WarehouseTable;
