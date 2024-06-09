import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './dashboard.tsx'
import './index.css'
import {ClerkProvider} from "@clerk/clerk-react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PostSignUp from "./post-sign-up.tsx";
import PostSignIn from "./post-sign-in.tsx";
import SalableProvider from "./salable/salable-context.tsx";
import ProView from "./pro-view.tsx";
import ProRoute from "./routes/pro-route.tsx";
import AuthenticatedRoute from "./routes/authenticated-route.tsx";
import DashboardRoute from "./routes/dashboard-route.tsx";
import PriceList from "./price-list.tsx";
import BespokeRoute from "./routes/bespoke-route.tsx";
import BespokeView from "./bespoke-view.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
    {
        element: <DashboardRoute/>,
        path: "/",
        children: [
            {
                element: <PriceList/>,
                path: '/',
            },
            {
                path: "/dashboard",
                element: <AuthenticatedRoute/>,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard/>,
                    },
                    {
                        element: <ProRoute capability={'pro'}/>,
                        path: "/dashboard",
                        children: [
                            {path: "/dashboard/pro-view", element: <ProView/>},
                        ]
                    },
                    {
                        element: <BespokeRoute capability={'bespoke'}/>,
                        path: "/dashboard",
                        children: [
                            {path: "/dashboard/bespoke-view", element: <BespokeView/>},
                        ]
                    },
                ]
            }
        ]
    },
    {
        element: <AuthenticatedRoute/>,
        path: "auth",
        children: [
            {
                path: "/auth/post-sign-up",
                element: <PostSignUp/>,
            },
            {
                path: "/auth/post-sign-in",
                element: <PostSignIn/>,
            },
        ]
    },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <SalableProvider>
                <RouterProvider router={router}/>
            </SalableProvider>
        </ClerkProvider>
    </React.StrictMode>,
);
