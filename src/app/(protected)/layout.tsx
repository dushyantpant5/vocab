import MobileSidebar from "@/components/MobileSidebar";
import Sidebar from "@/components/server-components/Sidebar";


export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {

    return <>
        <div className="flex min-h-screen">
            <Sidebar />
            <MobileSidebar />
            <section className="flex-1 p-6 bg-gray-50 mt-16 lg:mt-0">
                {children}
            </section>
        </div>
    </>

}