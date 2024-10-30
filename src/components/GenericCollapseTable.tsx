import { Box, Collapse, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import MainCard from './MainCard';
import { ExpandLess, ExpandMore, Save } from '@mui/icons-material';
import { Table } from '@mui/material';
import { TableBody } from '@mui/material';
import { useState, useEffect } from 'react';

type DataItem = Record<string, any>;

interface CollapseTableProps<T extends DataItem> {
  data: T[];
  type: string;
  headers: string[];
  fields: (keyof T)[];
  idField: keyof T;
  actions?: (item: T, onStartEdit: (item: T) => void) => React.ReactNode;
  onEdit?: (item: T, newValue: number) => void;
  onEditingChange?: (isEditing: boolean) => void;
}

function GenericCollapseTable<T extends DataItem>({
  data,
  type,
  headers,
  fields,
  idField,
  actions,
  onEdit,
  onEditingChange
}: CollapseTableProps<T>) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('0');

  useEffect(() => {
    onEditingChange?.(editingId !== null);
  }, [editingId, onEditingChange]);

  const handleStartEdit = (item: T) => {
    setEditingId(item[idField] as string);
    setEditValue(item.cantidad.toString());
  };

  const handleSaveEdit = (item: T) => {
    const numValue = Number(editValue);
    if (numValue >= 1) {
      onEdit?.(item, numValue);
      setEditingId(null);
    }
  };

  return (
    <MainCard>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {open ? (
          <ExpandLess onClick={() => setOpen(!open)} aria-expanded={open} aria-label="show less" />
        ) : (
          <ExpandMore onClick={() => setOpen(!open)} aria-expanded={open} aria-label="show more" />
        )}
        <Typography sx={{ fontWeight: 'bold' }}>{type}</Typography>
      </Box>
      <Collapse in={open}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
                {actions && <TableCell>Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {fields.map((field) => (
                    <TableCell key={String(field)}>
                      {editingId === item[idField] && field === 'cantidad' ? (
                        <TextField
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          error={editValue !== '' && Number(editValue) < 1}
                          helperText={editValue !== '' && Number(editValue) < 1 ? 'Mínimo 1' : ''}
                          slotProps={{
                            input: {
                              slotProps: {
                                input: {
                                  min: 1
                                }
                              }
                            }
                          }}
                          size="small"
                        />
                      ) : (
                        item[field]
                      )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      {editingId === item[idField] ? (
                        <Tooltip title="Guardar">
                          <IconButton onClick={() => handleSaveEdit(item)} disabled={editValue !== '' && Number(editValue) < 1}>
                            <Save />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        actions(item, handleStartEdit)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </MainCard>
  );
}

export default GenericCollapseTable;
