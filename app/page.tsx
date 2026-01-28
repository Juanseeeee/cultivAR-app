import { redirect } from "next/navigation"
import { cookies } from "next/headers"
 
export default async function Home() {
  const cookieStore = await cookies()
  const hasSession = cookieStore.get("sb-access-token") || cookieStore.get("sb:token")
  redirect("/inicio")
}
