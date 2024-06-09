import ProtectedResponsePanel from "./components/protected-response-panel.tsx";
import Notes from "./components/notes.tsx";
import FrontCapabilitiesPanel from "./components/frontend-capabilities-panel.tsx";
import {Link} from "react-router-dom";


function Dashboard() {
    return (
        <>
            <h1 className='text-2xl mb-4 font-bold'>Capabilities using Clerk Public Metadata</h1>
            <Link to='/dashboard/protected-view' className='btn btn-neutral'>View Protected Dashboard</Link>
            <div className='flex flex-col gap-4 mt-4'>
                <FrontCapabilitiesPanel/>
                <ProtectedResponsePanel capability='eap'/>
                <Notes/>
            </div>
        </>
    );
}

export default Dashboard
