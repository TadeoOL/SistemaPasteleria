import { Tooltip, useTheme } from '@mui/material';

// third-party
import { CSVLink } from 'react-csv';
import { Headers } from 'react-csv/lib/core';

// assets
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';

// ==============================|| CSV EXPORT ||============================== //

interface CSVExportProps {
  data: never[] | any[];
  filename: string;
  headers?: Headers;
}

export default function CSVExport({ data, filename, headers }: CSVExportProps) {
  const theme = useTheme();

  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Tooltip title="Exportar a CSV">
        <DownloadOutlined style={{ fontSize: '24px', color: theme.palette.text.secondary, marginTop: 4, marginRight: 4, marginLeft: 4 }} />
      </Tooltip>
    </CSVLink>
  );
}
