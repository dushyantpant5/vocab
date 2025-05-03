import MobileSidebar from "@/components/MobileSidebar";
import Sidebar from "@/components/server-components/Sidebar";
import { getUserId } from "@/helpers/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {

    const { user } = await getUserId();

    if (!user || user.id.length === 0) {
        redirect("/signIn")
    }
    else {
        return <>
            <div className="flex min-h-screen">
                <Sidebar />
                <MobileSidebar />
                <section className="flex-1 p-6 bg-gray-50">
                    {children}
                </section>
            </div>
        </>
    }

}