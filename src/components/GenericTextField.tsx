import { FormControl, FormHelperText, TextFieldProps } from '@mui/material';
import { InputLabel } from '@mui/material';
import { TextField } from '@mui/material';
import { Control, FieldError, FieldValues, Controller, Path } from 'react-hook-form';

type GenericTextFieldProps<T extends FieldValues> = TextFieldProps & {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
};

const GenericTextField = <T extends FieldValues>({ label, name, control, error, ...rest }: GenericTextFieldProps<T>) => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Controller control={control} name={name} render={({ field }) => <TextField id={name} {...field} {...rest} />} />
      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
};

export default GenericTextField;
