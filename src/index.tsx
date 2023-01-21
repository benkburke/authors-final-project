import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reflect-metadata';
import { App } from './app';
import { InjectionProvider } from './core/providers/Injection';
import { ValidationProvider } from './core/providers/Validation';
import { container } from './ioc';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <InjectionProvider container={container}>
      <ValidationProvider>
        <App />
      </ValidationProvider>
    </InjectionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
