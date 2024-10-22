import { Table as MUITable, TableBody as MUITableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Box } from '@mui/material';
import { Table, flexRender } from '@tanstack/react-table';
import HeaderSort from './HeaderSort';
import EmptyTable from './EmptyTable';

interface TableBodyProps<T extends object> {
  table: Table<T>;
}

function TableBody<T extends object>({ table }: TableBodyProps<T>) {
  return (
    <TableContainer>
      <MUITable>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (!header.column.getIsVisible()) return null;
                return (
                  <TableCell key={header.id} onClick={header.column.getToggleSortingHandler()}>
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
        <MUITableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={table.getAllLeafColumns().length} align="center">
                <EmptyTable msg="No hay datos para mostrar" />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </MUITableBody>
      </MUITable>
    </TableContainer>
  );
}

export default TableBody;
