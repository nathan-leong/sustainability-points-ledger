import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#285859',
    },
    secondary: {
      main: '#F9D949',
    },
  },
});

const APP_ID = process.env.REACT_APP_MORALIS_APP_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <BrowserRouter>
          <Routes>
            <Route path="/app" element={<App moralisAppId={APP_ID} />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </MoralisProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
