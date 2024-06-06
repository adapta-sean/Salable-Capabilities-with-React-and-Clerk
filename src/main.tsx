import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ClerkProvider} from "@clerk/clerk-react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PostSignUp from "./post-sign-up.tsx";
import PostSignIn from "./post-sign-in.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/post-sign-up",
        element: <PostSignUp/>,
    },
    {
        path: "/post-sign-in",
        element: <PostSignIn/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <RouterProvider router={router}/>
        </ClerkProvider>
    </React.StrictMode>,
);
