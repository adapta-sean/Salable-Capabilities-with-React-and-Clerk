import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/clerk-react";

import {Link, useLocation} from "react-router-dom";

export default function Header() {
    const {pathname} = useLocation();
    return (
        <header className="container mx-auto mb-8 navbar bg-base-300 rounded-2xl">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Salable Demo</a>
            </div>
            <div className="flex-none">
                <SignedOut>
                    <SignInButton
                        forceRedirectUrl={`${import.meta.env.VITE_HOST}/auth/post-sign-in`}
                        signUpForceRedirectUrl={`${import.meta.env.VITE_HOST}/auth/post-sign-up`}
                    >
                        <button className="btn btn-neutral">Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div className='flex gap-4 pr-4'>
                        {pathname === '/' ? <Link to='/dashboard' className="btn btn-neutral">Go to Dashboard</Link> : null}
                        <UserButton/>
                    </div>
                </SignedIn>
            </div>
        </header>
    )
}