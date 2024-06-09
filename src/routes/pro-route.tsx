import {Link, Outlet} from "react-router-dom"
import {useSalable} from "../salable/use-salable.ts";

type ProDashboardProps = {
    capability?: string,
}

export default function ProRoute({capability}: ProDashboardProps) {
    const {hasCapability} = useSalable();

    if (capability && !hasCapability(capability)) return (
        <div className='container mx-auto my-8'>
            <div role="alert" className="alert bg-base-300 mb-6">
                <p className='mb-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>Not Authorised, please upgrade to view this page</span>
                </p>
                <Link to='/dashboard' className='btn btn-neutral'>Back to Dashboard</Link>
            </div>
            <Link to='/dashboard' className='btn btn-neutral'>Back to Dashboard</Link>
        </div>
    );

    return (
        <>
            <h1 className='text-2xl mb-4 font-bold'>Pro Dashboard</h1>
            <Outlet/>
        </>
    )
}