import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import {useUser} from "@clerk/clerk-react";

export default function FrontCapabilitiesPanel() {
    const {user} = useUser();

    const capabilities = user?.publicMetadata?.capabilities as string[] | undefined;

    if (!capabilities) return <p>No License</p>;

    return (
        <div>
            <h2 className='text-xl mb-4 font-bold'>Frontend Capabilities</h2>
            <p className='mb-4'>Capabilities available in the frontend from <code
                className='text-gray-400'>user.publicMetadata.capabilities</code></p>
            <div className='md:columns-3 sm:columns-2'>
                <ul>
                    {Object.entries(capabilities)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([capability, expiry]) =>
                            <li key={capability}>
                                <p className='leading-5 mb-2'>
                                    <span className='font-bold'>{capability}</span><br/>
                                    <span className='text-gray-400 italic text-sm'>
                                        {new Date(expiry) > new Date()
                                            ? `expires in ${formatDistanceToNow(new Date(expiry))}`
                                            : `expired ${formatDistanceToNow(new Date(expiry))} ago`}
                                    </span>
                                </p>
                            </li>
                        )}
                </ul>
            </div>
        </div>
    )
}