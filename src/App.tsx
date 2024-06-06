import {SignedIn, SignedOut, SignInButton, useAuth, UserButton, useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";

type CapabilitiesFromJwt = { message: string, capabilities: Record<string, string> };

function App() {
    const [capabilitiesFromJwt, setCapabilitiesFromJwt] = useState<CapabilitiesFromJwt | null>(null);
    const {isSignedIn, user, isLoaded} = useUser();
    const {getToken} = useAuth();

    const capabilities = user?.unsafeMetadata?.capabilities as string[] | undefined;

    useEffect(() => {
        if (!isSignedIn || !user || !getToken) return;
        const getThing = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    // Todo: figure out what to do here
                    console.log('Failed to get jwt token for request');
                    return;
                }
                const response = await fetch(
                    `https://wprhk5jxsh.execute-api.eu-west-1.amazonaws.com/prod/capabilities-from-jwt`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (response.ok) {
                    const newThing = await response.json();
                    setCapabilitiesFromJwt(newThing);
                } else {
                    setCapabilitiesFromJwt(null); // Todo: proper error handling need here
                }
            } catch (e) {
                setCapabilitiesFromJwt(null);
                console.log('Failed at post sign in licence check', e);
            }
        };
        void getThing();
    }, [isSignedIn, user, getToken]);

    const capabilitiesJson = capabilitiesFromJwt ? Object.entries(capabilitiesFromJwt.capabilities) : null;

    return (
        <div className='py-8'>
            <header className="container mx-auto mb-16 pr-8 navbar bg-base-300 rounded-2xl">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Salable Demo</a>
                </div>
                <div className="flex-none">
                    <SignedOut>
                        <SignInButton
                            forceRedirectUrl={`${import.meta.env.VITE_HOST}/post-sign-in`}
                            signUpForceRedirectUrl={`${import.meta.env.VITE_HOST}/post-sign-up`}
                        />
                    </SignedOut>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                </div>
            </header>
            <main className={'container mx-auto'}>
                <h1 className='text-2xl mb-4'>Capabilities using Clerk Metadata</h1>
                {isLoaded ? (
                    <>
                        {
                            isSignedIn ? (
                                <div className='flex flex-col gap-4'>
                                    {capabilities ? (
                                        <div>
                                            <h2 className='text-xl mb-4'>Capabilities</h2>
                                            <ul>
                                                {Object.entries(capabilities)
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([capability, expiry]) =>
                                                    <li key={capability}><p className='leading-5 mb-2'><span className='font-bold'>{capability}</span><br/><span className='text-gray-400 italic text-sm'>expires in {formatDistanceToNow(new Date(expiry))}</span></p></li>
                                                )}
                                            </ul>
                                        </div>
                                    ) : <p>No License</p>}
                                    {isSignedIn && capabilitiesFromJwt && capabilitiesJson ? (
                                        <div>
                                            <h2 className='text-xl mb-4'>Protected API Request</h2>
                                            <p className='mb-4'>{capabilitiesFromJwt.message}</p>
                                            <p className='text-gray-400 italic mb-2'>Capabilities Extracted from JWT in API request</p>
                                            <div className="mockup-code">
                                                <pre data-prefix='1'><code>{'{'}</code></pre>
                                                {capabilitiesJson.map(([capability, expiry], i) => (
                                                    <pre data-prefix={i + 2}><code>    <span className='text-warning'>"{capability}"</span>: <span className='text-warning'>"{expiry}"{i === capabilitiesJson.length ? ',' : ''}</span></code></pre>
                                                ))}
                                                <pre data-prefix={capabilitiesJson.length + 2}><code>{'}'}</code></pre>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex align-items-center gap-4'>
                                            <span className="loading loading-spinner loading-md"/>
                                            <span>Fetching…</span>
                                        </div>
                                    )}
                                </div>
                            ) : <p>Not Authenticated</p>
                        }
                    </>
                ) : (
                    <div className='flex align-items-center gap-4'>
                        <span className="loading loading-spinner loading-md"/>
                        <span>Authorising…</span>
                    </div>
                )}
            </main>
        </div>

    );
}

export default App
