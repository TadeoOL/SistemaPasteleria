import { FormControl, FormHelperText, TextFieldProps, IconButton, InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import { FieldError, FieldValues, Controller, Path, UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

type GenericTextFieldProps<T extends FieldValues> = TextFieldProps & {
  label: string;
  name: Path<T>;
  control: UseFormReturn<T>['control'];
  error?: FieldError;
};

const GenericTextField = <T extends FieldValues>({ label, name, control, error, type, ...rest }: GenericTextFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const renderPasswordAdornment = () => (
    <InputAdornment position="end">
      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <FormControl fullWidth>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <TextField
            id={name}
            label={label}
            {...rest}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              input: {
                endAdornment: type === 'password' ? renderPasswordAdornment() : undefined
              }
            }}
            {...field}
          />
        )}
      />
      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
};

export default GenericTextField;
