import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthContext } from './useAuthContext';
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useLogout = () => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch, user } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(false); 

    const logout = async () => {
        setError(null);
        setIsPending(true);

        try {
            const { uid } = user

            // await updateDoc(doc(db, "users", uid) ,{ online: false });
            await updateDoc(doc(db, "users", uid) ,{Available : false});

            // console.log("no error")

            await signOut(auth)
                .then(async ()=> {
                    console.log("the user is signed out")
                })
                .catch((err) => {
                    console.log("error in signing out: ", err.message)
                })


            dispatch( {type: 'LOGOUT'} )

            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
        }   
        catch(err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {

        return () => setIsCancelled(true);

    }, [])

    return { logout, error, isPending}
}
