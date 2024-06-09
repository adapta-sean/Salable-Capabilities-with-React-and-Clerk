import ProtectedResponsePanel from "./components/protected-response-panel.tsx";
import Notes from "./components/notes.tsx";
import FrontCapabilitiesPanel from "./components/frontend-capabilities-panel.tsx";
import {Link} from "react-router-dom";


function Dashboard() {
    return (
        <>
            <h1 className='text-2xl mb-4 font-bold'>Capabilities using Clerk Public Metadata</h1>
            <div className='flex gap-4'>
                <Link to='/dashboard/pro-view' className='btn btn-neutral'>Pro View</Link>
                <Link to='/dashboard/bespoke-view' className='btn btn-neutral'>Bespoke View</Link>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <FrontCapabilitiesPanel/>
                <ProtectedResponsePanel capability='eap'/>
                <Notes/>
            </div>
        </>
    );
}

export default Dashboard
