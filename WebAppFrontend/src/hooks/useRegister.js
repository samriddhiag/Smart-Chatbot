import { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';

import { useAuthContext } from './useAuthContext';
import { doc, setDoc } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(false); 

    const register = async (email, password, confirmPassword, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)

        let res="";
        if(password === confirmPassword){   
            // console.log("Equal") 
            await createUserWithEmailAndPassword(auth, email, password) 
                .then(async (cred) => {
                    dispatch({ type: 'LOADING', payload: true });
                res = cred

                let imgUrl="";

                if(thumbnail){
                    console.log("thumbnail->", thumbnail)
                    const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
                    const img = ref(storage, uploadPath)

                    await uploadBytes(img, thumbnail)
                    .then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                    });

                    await getDownloadURL(img)
                    .then((url) => {
                        console.log("url in getDownLoad->",url)
                        imgUrl = url
                    })
                    .catch((err) => {
                        console.log("error in uploading Thumbnail")
                    })
                }
                // else{
                //     const uploadPath = `thumbnails/DefaultCustomer/customer.png`
                //     const img = ref(storage, uploadPath)

                //     await getDownloadURL(img)
                //     .then((url) => {
                //         console.log("Default url in getDownLoad->",url)
                //         imgUrl = url
                //     })
                //     .catch((err) => {
                //         console.log("error in uploading Default customer Thumbnail")
                //     })
                // }

                await updateProfile(auth.currentUser, {displayName: displayName, photoURL: imgUrl})

                await setDoc(doc(db, 'users', res.user.uid), {
                    displayName: displayName, 
                    emailID: email,
                    userType: 0,
                    Available: false,
                    photoURL: imgUrl,
                    lastEngagedAt: ""
                })
    
                dispatch({ type: 'LOGIN', payload: res.user });
                dispatch({ type: 'LOADING', payload: false });
    
                if(!isCancelled){
                    setIsPending(false)
                    setError(null)
                }

            })
            .catch((err) => {
                if(!isCancelled){
                    console.log(err.message)
                    setError(err.message)
                    setIsPending(false)
                }
            })
                        
            // console.log("res = ",res);

            // if(!res){ 
            //     throw new Error("Error in signing up") 
            // }
        }
        else{
            if(!isCancelled){
                console.log("password donot match")
                setError("Firebase: Password do not Match")
                setIsPending(false)
            }   
        }
    }

    useEffect(() => {
    
        return () => setIsCancelled(true);

    }, [])

    return { error, isPending, register }
}
