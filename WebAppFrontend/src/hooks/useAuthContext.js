import { AuthContext } from "../context/AuthContext"
import { useContext } from "react" //useContext is an inbuilt hook

export const useAuthContext = () => {
    
    const context = useContext(AuthContext)

    if(!context) {
        throw Error('useAuthContext must be inside an AuthContextProvider');
    }

    return context
}