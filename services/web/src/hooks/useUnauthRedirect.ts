import { useRouter } from "next/router"
import { useEffect } from "react"
import useAuth from "./useAuth"

const REDIRECT_FROM_PATHS = ["/signin", "/signup"]
export default () => {
    const router = useRouter()
    const auth = useAuth()
    useEffect(() => {
        if (auth.userData && REDIRECT_FROM_PATHS.includes(router.pathname)) {
            router.push("/chat")
        }
    }, [auth.userData, router]);
}