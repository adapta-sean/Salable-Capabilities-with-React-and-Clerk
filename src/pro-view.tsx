import {Link} from "react-router-dom";

export default function ProView() {
    return (
        <>
            <p className='mb-4'>You have the `pro` capability</p>
            <Link to='/dashboard' className='btn btn-neutral'>Back to Dashboard</Link>
        </>
    )}