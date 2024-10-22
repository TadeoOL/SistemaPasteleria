import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel
} from '@tanstack/react-table';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import MainCard from '../../MainCard';
import ScrollX from '../../ScrollX';
import RowSelection from './RowSelection';
import TablePagination from './TablePagination';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

interface GenericTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  AddComponent?: React.ComponentType<any>;
  EditComponent?: React.ComponentType<any>;
  DeleteComponent?: React.ComponentType<any>;
  availableFilter?: boolean;
}

function GenericTable<T extends object>({
  data,
  columns,
  title,
  onAdd,
  availableFilter,
  AddComponent,
  EditComponent,
  DeleteComponent
}: GenericTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(true);
  const [rowSelection, setRowSelection] = useState({});
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => (availableFilter ? 'habilitado' in item && (item as any).habilitado === statusFilter : true));
  }, [statusFilter, data, availableFilter]);

  const [columnVisibility, setColumnVisibility] = useState(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      if ('show' in column) {
        initialVisibility[column.id as string] = column.show !== false;
      }
    });
    return initialVisibility;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnVisibility
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  });

  return (
    <MainCard content={false}>
      <TableHeader<T>
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAdd={onAdd}
        title={title}
        data={data}
        downSM={downSM}
        sorting={sorting}
        setSorting={setSorting}
        availableFilter={availableFilter}
      />
      <ScrollX>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableBody<T> table={table} />
        <Box sx={{ p: 2 }}>
          <TablePagination
            setPageSize={table.setPageSize}
            setPageIndex={table.setPageIndex}
            getState={table.getState}
            getPageCount={table.getPageCount}
          />
        </Box>
      </ScrollX>
      {AddComponent && <AddComponent />}
      {EditComponent && <EditComponent />}
      {DeleteComponent && <DeleteComponent />}
    </MainCard>
  );
}

export default GenericTable;
