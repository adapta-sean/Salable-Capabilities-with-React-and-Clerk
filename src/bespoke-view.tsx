import {Link} from "react-router-dom";

export default function BespokeView() {
    return (
        <>
            <p className='mb-4'>You have the `bespoke` capability</p>
            <Link to='/dashboard' className='btn btn-neutral'>Back to Dashboard</Link>
        </>
    )
}