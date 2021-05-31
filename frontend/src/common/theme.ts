import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3ED7C2",
    },
    secondary: {
      main: "#ff4b3a",
    },
    background: {
      default: "#202125",
      paper: "#16171B",
    },
    text: {
      primary: "rgba(173,186,199,1)",
      secondary: "rgba(173,186,199,0.7)",
      disabled: "rgba(173,186,199,0.5)",
      hint: "rgba(173,186,199,0.4)",
    },
  },
  typography: {
    fontFamily: ["Lexend Deca", "sans-serif"].join(","),
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
