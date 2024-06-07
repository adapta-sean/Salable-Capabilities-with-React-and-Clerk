import {SignUpButton, useAuth, useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import Layout from "./components/layout.tsx";

type CapabilitiesFromJwt = { message: string, capabilities: Record<string, string> };

function App() {
    const {isSignedIn, user, isLoaded} = useUser();
    const {getToken} = useAuth();
    const [protectedApiResponse, setProtectedApiResponse] = useState<CapabilitiesFromJwt | null>(null);

    const capabilities = user?.publicMetadata?.capabilities as string[] | undefined;
    const capabilitiesFromJwtList = protectedApiResponse ? Object.entries(protectedApiResponse.capabilities) : null;

    useEffect(() => {
        if (!isSignedIn || !user || !getToken) return;
        const getProtectedApiResponse = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    // Todo: error handling need here
                    console.log('Failed to get jwt token for request');
                    return;
                }
                const response = await fetch(
                    `https://wprhk5jxsh.execute-api.eu-west-1.amazonaws.com/prod/capabilities-from-jwt`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (!response.ok) {
                    setProtectedApiResponse(null); // Todo: error handling need here
                    return
                }
                const newProtectedApiResponse = await response.json();
                setProtectedApiResponse(newProtectedApiResponse);
            } catch (e) {
                setProtectedApiResponse(null);
                console.log('Failed at post sign in licence check', e);
            }
        };
        void getProtectedApiResponse();
    }, [isSignedIn, user, getToken]);

    if (!isLoaded) return (
        <div className='container mx-auto my-8'>
            <div role="alert" className="alert bg-base-300">
                <span className="loading loading-spinner loading-md"/>
                <span>Authorising…</span>
            </div>
        </div>
    );

    if (!isSignedIn) return (
        <Layout>
            <div className='container mx-auto my-8'>
                <div className="card w-96 bg-base-300 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Free Trial</h2>
                        <p className='mb-4'>Sign up to begin your free trial</p>
                        <div className="card-actions">
                            <SignUpButton
                                forceRedirectUrl={`${import.meta.env.VITE_HOST}/post-sign-up`}
                                signInForceRedirectUrl={`${import.meta.env.VITE_HOST}/post-sign-in`}
                            >
                                <button className="btn btn-neutral">Sign Up</button>
                            </SignUpButton>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <h1 className='text-2xl mb-4'>Capabilities using Clerk Public Metadata</h1>
            {isSignedIn ? (
                <div className='flex flex-col gap-4'>
                    {capabilities ? (
                        <div>
                            <h2 className='mb-4'>Capabilities available in the frontend from <code className='text-gray-400 italic'>user.publicMetadata.capabilities</code></h2>
                            <ul>
                                {Object.entries(capabilities)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([capability, expiry]) =>
                                        <li key={capability}><p className='leading-5 mb-2'><span
                                            className='font-bold'>{capability}</span><br/><span
                                            className='text-gray-400 italic text-sm'>expires in {formatDistanceToNow(new Date(expiry))}</span>
                                        </p></li>
                                    )}
                            </ul>
                        </div>
                    ) : <p>No License</p>}
                    {isSignedIn && protectedApiResponse && capabilitiesFromJwtList ? (
                        <div>
                            <h2 className='text-xl mb-4'>Protected API Request</h2>
                            <p className='mb-4'>{protectedApiResponse.message}</p>
                            <p className='text-gray-400 italic mb-2'>Capabilities Extracted from JWT in
                                API request</p>
                            <div className="mockup-code">
                                <pre data-prefix='1'><code>{'{'}</code></pre>
                                {capabilitiesFromJwtList.map(([capability, expiry], i) => (
                                    <pre data-prefix={i + 2}><code>    <span
                                        className='text-warning'>"{capability}"</span>: <span
                                        className='text-warning'>"{expiry}"{i === capabilitiesFromJwtList.length ? ',' : ''}</span></code></pre>
                                ))}
                                <pre data-prefix={capabilitiesFromJwtList.length + 2}><code>{'}'}</code></pre>
                            </div>
                        </div>
                    ) : (
                        <div className='flex align-items-center gap-4'>
                            <span className="loading loading-spinner loading-md"/>
                            <span>Fetching…</span>
                        </div>
                    )}
                </div>
            ) : <p>Not Authenticated</p>}
        </Layout>
    );
}

export default App
