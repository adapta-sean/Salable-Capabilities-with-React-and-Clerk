import {SignedIn, SignedOut, SignInButton, useAuth, UserButton, useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";

function App() {
    const [thing, setThing] = useState<{ data: string } | null>(null);
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
                    `https://wprhk5jxsh.execute-api.eu-west-1.amazonaws.com/prod/thing`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (response.ok) {
                    const newThing = await response.json();
                    setThing(newThing);
                } else {
                    setThing({data: "Not authorised to view this"}); // Todo: proper error handling need here
                }
            } catch (e) {
                setThing(null);
                console.log('Failed at post sign in licence check', e);
            }
        };
        void getThing();
    }, [isSignedIn, user, getToken]);

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
                                    {isSignedIn && thing ? (
                                        <div>
                                            <h2 className='text-xl'>Protected API Request</h2>
                                            <p>{thing.data}</p>
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
