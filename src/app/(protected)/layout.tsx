import { getUserId } from "@/helpers/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {

    const { user } = await getUserId();

    if (!user || user.id.length === 0) {
        redirect("/signIn")
    }
    else {
        return <>{children}</>
    }

}