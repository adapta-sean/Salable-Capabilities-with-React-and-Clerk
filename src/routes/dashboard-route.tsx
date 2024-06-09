import {Outlet} from "react-router-dom";
import Header from "../components/header.tsx";

export default function DashboardRoute() {
    return (
        <div className='p-8'>
            <Header/>
            <main className={'container mx-auto'}>
                <Outlet/>
            </main>
        </div>
    )
}
