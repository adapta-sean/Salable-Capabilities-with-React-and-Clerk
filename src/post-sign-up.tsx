import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth, useUser} from "@clerk/clerk-react";

export default function PostSignUp() {
    const [authorising, setAuthorising] = useState<boolean>(true);
    const {isSignedIn, user} = useUser();
    const {getToken} = useAuth();

    useEffect(() => {
        if(!isSignedIn || !user || !getToken) return;
        const postSignUp = async () => {
            try {
                const token = await getToken();
                if(!token) {
                    // Todo: error handling needed here
                    console.log('Failed to get jwt token for request');
                    return;
                }
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/post-sign-up`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if(!response.ok) {
                    // Todo: error handling needed here
                    console.log('Failed to check license');
                    return;
                }
                await user.reload();
            } catch (e) {
                console.log('Failed at post sign in licence check', e);
            } finally {
                setAuthorising(false);
            }
        };
        void postSignUp();
    }, [isSignedIn, user, getToken]);

    if (!authorising) return <Navigate to="/dashboard" replace={true}/>;

    return (
        <div className='container mx-auto my-8'>
            <div role="alert" className="alert bg-base-300">
                <span className="loading loading-spinner loading-md"/>
                <span>Authorising…</span>
            </div>
        </div>
    );
}