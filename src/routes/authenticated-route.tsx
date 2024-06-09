import {useUser} from "@clerk/clerk-react"
import {Outlet, useNavigate} from "react-router-dom"
import {useEffect} from "react";

export default function AuthenticatedRoute() {
    const {isSignedIn, isLoaded} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !isSignedIn) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, isSignedIn]);

    if (!isLoaded) return (
        <div className='container mx-auto my-8'>
            <div role="alert" className="alert bg-base-300">
                <span className="loading loading-spinner loading-md"/>
                <span>Authorising…</span>
            </div>
        </div>
    );

    return (
        <Outlet/>
    )
}