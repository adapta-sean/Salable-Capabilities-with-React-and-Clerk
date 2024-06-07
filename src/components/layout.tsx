import Header from "./header.tsx";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className='p-8'>
            <Header/>
            <main className={'container mx-auto'}>
                {children}
            </main>
        </div>
    )
}
