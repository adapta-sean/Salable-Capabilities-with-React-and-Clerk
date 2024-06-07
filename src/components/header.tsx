import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/clerk-react";

export default function Header() {
    return (
        <header className="container mx-auto mb-8 navbar bg-base-300 rounded-2xl">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Salable Demo</a>
            </div>
            <div className="flex-none">
                <SignedOut>
                    <SignInButton
                        forceRedirectUrl={`${import.meta.env.VITE_HOST}/post-sign-in`}
                        signUpForceRedirectUrl={`${import.meta.env.VITE_HOST}/post-sign-up`}
                    >
                        <button className="btn btn-neutral">Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div className='pr-4'>
                        <UserButton/>
                    </div>
                </SignedIn>
            </div>
        </header>
    )
}