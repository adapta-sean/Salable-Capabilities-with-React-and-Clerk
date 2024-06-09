import {SignUpButton} from "@clerk/clerk-react";

export default function PriceList() {
    return (
        <div className='container mx-auto my-8'>
            <div className="card w-96 bg-base-300 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Free Trial</h2>
                    <p className='mb-4'>Sign up to begin your free trial</p>
                    <div className="card-actions">
                        <SignUpButton
                            forceRedirectUrl={`${import.meta.env.VITE_HOST}/auth/post-sign-up`}
                            signInForceRedirectUrl={`${import.meta.env.VITE_HOST}/auth/post-sign-in`}
                        >
                            <button className="btn btn-neutral">Sign Up</button>
                        </SignUpButton>
                    </div>
                </div>
            </div>
        </div>
    )
}