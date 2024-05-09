import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider
} from "@mui/material";

import App from './App.jsx'
import HomePage from './pages/HomePage.jsx';
import AddItemFormPage from './pages/AddItemFormPage.jsx';
import ItemsPage from './pages/ItemsPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        index: true
      },
      {
        path: "/items",
        element: <ItemsPage />
      },
      {
        path: "/addItem",
        element: <AddItemFormPage />
      }
    ]
  }
])
const theme = createTheme({
  palette: {
    primary: {
      main: "#fb8c00"
    },
    secondary: {
      main: "#f5bb47"
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
