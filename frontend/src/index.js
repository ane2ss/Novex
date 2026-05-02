import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: '#222a3d',
                    color: '#dae2fd',
                    border: '1px solid #464555',
                    borderRadius: '12px',
                },
            }}
        />
        <App />
    </React.StrictMode>
);