import {createContext, ReactNode, useEffect} from 'react';
import {useAuth, useUser} from "@clerk/clerk-react";

type SalableContextType = {
    hasCapability: (requiredCapability: string) => boolean,
}

const defaultProps: SalableContextType = {
    hasCapability: () => false,
};

export const SalableContext = createContext<SalableContextType>(defaultProps);

type SalableProps = { children: ReactNode }

export default function SalableProvider({children}: SalableProps) {
    const {isSignedIn, user} = useUser();
    const {getToken} = useAuth();
    const capabilities = user?.publicMetadata?.capabilities as Record<string, string> | undefined;

    const hasCapability = (requiredCapability: string) => {
        if (!isSignedIn || !capabilities || !(requiredCapability in capabilities)) return false;
        const expirationDate = new Date(capabilities[requiredCapability]);
        return new Date() <= expirationDate;
    };

    useEffect(() => {
        if (!isSignedIn || !user || !getToken) return;
        const licenseCheck = async () => {
            if (!isSignedIn || !user || !getToken) return;
            const token = await getToken();
            if (!token) {
                // Todo: error handling needed here, consider retry and/or showing a toast message.
                console.log('Failed to get jwt token for request');
                return;
            }
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/license-check`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            if (!response.ok) {
                // Todo: error handling needed here, consider retry and/or showing a toast message.
                console.log('Failed to check license');
                return;
            }
            await user.reload();
        };
        void licenseCheck();
        const interval = setInterval(licenseCheck, 3_600_000);
        return () => {
            clearInterval(interval)
        };
    }, [isSignedIn, user, getToken]);

    return (
        <SalableContext.Provider value={{hasCapability}}>
            {children}
        </SalableContext.Provider>
    );
}
