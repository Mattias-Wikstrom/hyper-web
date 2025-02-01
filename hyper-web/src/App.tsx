import Hyper from "./Hyper";
import './App.css'
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
function App() {
  return (
    <>
        <React.StrictMode>
          <ThemeProvider theme={theme}>
            <Hyper />
          </ThemeProvider>
        </React.StrictMode>
    </>
  )
}

export default App
