import { PaletteColorOptions } from '@mui/material';
// types
import { PaletteThemeProps } from '../../types/theme';
import { PalettesProps } from '@ant-design/colors';

// ==============================|| PRESET THEME - DEFAULT ||============================== //

export default function Default(colors: PalettesProps): PaletteThemeProps {
  const {  grey } = colors;
  const greyColors: PaletteColorOptions = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };

  const pastrySoftPink = ['#FFF0F5', '#FFE4E1', '#FFC0CB', '#FFB6C1', '#FFA07A', '#FF8C69', '#FF7F50', '#FF6347', '#FF4500', '#FF3030'];
  const pastrySoftBlue = ['#E6F3FF', '#CCE7FF', '#99CFFF', '#66B8FF', '#33A0FF', '#0088FF', '#0066CC', '#004C99', '#003366', '#001933'];
  const pastrySoftYellow = ['#FFFACD', '#FFF8DC', '#FFFFE0', '#FFFACD', '#FAFAD2', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#EEE8AA', '#F0E68C'];
  const pastrySoftGreen = ['#F0FFF0', '#E0FFE0', '#C1FFC1', '#A3FFA3', '#85FF85', '#66FF66', '#47FF47', '#29FF29', '#0AFF0A', '#00FF00'];

  const contrastText = '#4A4A4A';  

  return {
    primary: {
      lighter: pastrySoftPink[0],
      100: pastrySoftPink[1],
      200: pastrySoftPink[2],
      light: pastrySoftPink[3],
      400: pastrySoftPink[4],
      main: pastrySoftPink[5],
      dark: pastrySoftPink[6],
      700: pastrySoftPink[7],
      darker: pastrySoftPink[8],
      900: pastrySoftPink[9],
      contrastText
    },
    secondary: {
      lighter: pastrySoftBlue[0],
      100: pastrySoftBlue[1],
      200: pastrySoftBlue[2],
      light: pastrySoftBlue[3],
      400: pastrySoftBlue[4],
      main: pastrySoftBlue[5],
      600: pastrySoftBlue[6],
      dark: pastrySoftBlue[7],
      800: pastrySoftBlue[8],
      darker: pastrySoftBlue[9],
      A100: pastrySoftBlue[0],
      A200: pastrySoftBlue[2],
      A300: pastrySoftBlue[4],
      contrastText
    },
    error: {
      lighter: '#FFE6E6',
      light: '#FFCCCC',
      main: '#FF9999',
      dark: '#FF6666',
      darker: '#FF3333',
      contrastText
    },
    warning: {
      lighter: pastrySoftYellow[0],
      light: pastrySoftYellow[2],
      main: pastrySoftYellow[4],
      dark: pastrySoftYellow[6],
      darker: pastrySoftYellow[8],
      contrastText
    },
    info: {
      lighter: pastrySoftBlue[0],
      light: pastrySoftBlue[2],
      main: pastrySoftBlue[4],
      dark: pastrySoftBlue[6],
      darker: pastrySoftBlue[8],
      contrastText
    },
    success: {
      lighter: pastrySoftGreen[0],
      light: pastrySoftGreen[2],
      main: pastrySoftGreen[4],
      dark: pastrySoftGreen[6],
      darker: pastrySoftGreen[8],
      contrastText
    },
    grey: greyColors
  };
}
