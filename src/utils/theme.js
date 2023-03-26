import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 1024,
            lg: 1300,
            xl: 1600,
            mobile: 420,
        },
    },
    palette: {
        primary: {
            main: "#2B52A4",
        },
        secondary: {
            main: "#222222",
        },
        neutral: {
            main: "#E9EFFD",
            contrastText: "#fff",
        },
        text: {
            primary: "#ffff",
        },
    },
});

// typography variants

// for main heading banners



theme.typography.new = {
    fontSize: ".5rem",
    color: "yellow",
};

export default theme;