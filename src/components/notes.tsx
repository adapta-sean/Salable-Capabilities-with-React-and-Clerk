export default function Notes() {
    return (
        <div className='max-w-prose'>
            <h2 className='text-xl mb-4 font-bold'>Notes</h2>
            <p className='mb-4'>Upon signing up, the user will be redirected to the <code
                className='text-gray-400'>/post-sign-up</code> React view. From here, a request is made to <code
                className='text-gray-400'>/post-sign-up</code> AWS Lambda, which generates a license for the
                new user, performs a license check, and stores the capabilities in the Clerk user's public
                metadata.
            </p>

            <p className='mb-4'>The public metadata is available in Clerk Sessions and Clerk JWT templates,
                providing
                access in the frontend application via <code className='text-gray-400'>useUser()</code> and
                authenticated requests via JWT claims.</p>

            <p className='mb-4'>On signing in, the user is redirected to <code
                className='text-gray-400'>/post-sign-in</code> and
                React view, which then sends a
                request to the <code className='text-gray-400'>/license-check</code> AWS Lambda. This Lambda
                function
                performs a license check and stores the
                capabilities in the Clerk user's public metadata.</p>

            <p className='mb-4'>The <code className='text-gray-400'>/license-check</code> AWS Lambda can be
                called
                whenever you want to refresh the license. It
                can be triggered on window focus, page navigation, or periodically revalidated, for example,
                once
                every
                hour. Utilizing a library like TanStack Query or SWR can be beneficial for this.</p>
        </div>
    )
}