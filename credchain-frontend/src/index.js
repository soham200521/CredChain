import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Auth0Provider } from '@auth0/auth0-react';

function getLibrary(provider) {
  return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Auth0Provider
    domain="dev-v6bucnzaq1tggaj8.us.auth0.com"
    clientId="cZXUsbpYu4yyMOC0CFc76JxWIT1F9XLt"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>
  </Auth0Provider>
);
