import { ForwardedRef, forwardRef } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { FieldValues, Controller, Path, Control } from 'react-hook-form';

interface GenericSelectProps<T, TOption> {
  name: keyof T;
  label: string;
  control: Control<T & FieldValues>;
  options: TOption[];
  getOptionLabel: (option: TOption) => string;
  getOptionValue: (option: TOption) => any;
  isLoading?: boolean;
}

const GenericSelect = forwardRef(
  <T extends FieldValues, TOption>(
    { label, name, control, options, getOptionLabel, getOptionValue, isLoading }: GenericSelectProps<T, TOption>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <FormControl fullWidth>
        <Controller
          name={name as Path<T>}
          control={control}
          disabled={isLoading}
          render={({ field, fieldState }) => (
            <TextField select label={label} {...field} inputRef={ref} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {isLoading ? (
                <MenuItem>
                  <i>Cargando...</i>
                </MenuItem>
              ) : (
                options.map((option) => (
                  <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
                    {getOptionLabel(option)}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        />
      </FormControl>
    );
  }
);

GenericSelect.displayName = 'GenericSelect';
export default GenericSelect as <T extends FieldValues, TOption>(
  props: GenericSelectProps<T, TOption> & { ref?: React.Ref<HTMLDivElement> }
) => JSX.Element;
