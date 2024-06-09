import {useEffect, useState} from "react";
import {useAuth, useUser} from "@clerk/clerk-react";
import {useSalable} from "../salable/use-salable.ts";

type ProtectedResponsePanelProps = {
    capability: string
}

type CapabilitiesFromJwt = { message: string, capabilities: Record<string, string> };

export default function ProtectedResponsePanel({capability}: ProtectedResponsePanelProps) {
    const {isSignedIn} = useUser();
    const {getToken} = useAuth();
    const {hasCapability} = useSalable();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [protectedApiResponse, setProtectedApiResponse] = useState<CapabilitiesFromJwt | null>(null);
    const capabilitiesFromJwtList = protectedApiResponse ? Object.entries(protectedApiResponse.capabilities) : null;

    useEffect(() => {
        if (!isSignedIn || !getToken) return;
        const getProtectedApiResponse = async () => {
            setIsFetching(true);
            try {
                const token = await getToken();
                if (!token) {
                    setErrorMessage('Failed to get jwt token for protected data request');
                    return;
                }
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/capabilities-from-jwt`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (!response.ok) {
                    setProtectedApiResponse(null); // Todo: error handling need here
                    setErrorMessage('Failed to fetch protected data');
                    return
                }
                const newProtectedApiResponse = await response.json();
                setProtectedApiResponse(newProtectedApiResponse);
                setErrorMessage(null);
            } catch (e) {
                setProtectedApiResponse(null);
                console.error(e);
                setErrorMessage('Failed to fetch protected data');
            } finally {
                setIsFetching(false);
            }
        };
        void getProtectedApiResponse();
    }, [isSignedIn, getToken]);

    if (!isSignedIn) return (
        <div role="alert" className="alert bg-base-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                 viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>Unauthenticated</span>
        </div>
    );

    /**
     * Note: the endpoint this route hits is also requires the `eap` capability to be in the jwt claims.
     */
    if (!hasCapability(capability)) return (
        <div role="alert" className="alert bg-base-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                 viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>Unauthorised</span>
        </div>
    );

    if (isFetching) return (
        <div className='flex align-items-center gap-4'>
            <span className="loading loading-spinner loading-md"/>
            <span>Fetching…</span>
        </div>
    );

    if (errorMessage) return (
        <div role="alert" className="alert bg-base-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                 viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{errorMessage}</span>
        </div>
    );

    if (!(protectedApiResponse && capabilitiesFromJwtList)) {
        return (
            <div role="alert" className="alert bg-base-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>No data</span>
            </div>
        )
    }

    return (
        <div>
            <h2 className='text-xl mb-4 font-bold'>Backend Capabilities</h2>
            <p className='mb-4'>{protectedApiResponse.message}</p>
            <p className='text-gray-400 italic mb-2'>Capabilities Extracted from JWT claims in
                a authenticated API request</p>
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
    )
}