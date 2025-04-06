import { useState, useEffect } from 'react'
import { auth, db, storage } from '../firebase'
import { useAuthContext } from './useAuthContext'
import { ref, getDownloadURL} from "firebase/storage";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()


  const getType = async (type, user) => {
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      type.usertype = docSnap.data().userType
    }
    else{
      console.log("No document with such user credentials exists")
    }

    // if(user)
    //   console.log("user->id", user.uid, "type->", type.usertype)

  }
 
  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    let user = ""
    let type = {usertype: 0}

      // console.log("fine till now")

      await signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          dispatch({ type: 'LOADING', payload: true })
          user = res.user
          console.log(res.user)

          dispatch({ type: 'LOGIN', payload: res.user })

          if (!isCancelled) {
            setIsPending(false)
            setError(null)
          }
      })
      .catch((err) => {
          if (!isCancelled) {
            setError(err.message)
            setIsPending(false)
          }
      })

      await getType(type, user)
      .then(() => {
        dispatch({ type: 'TYPE', payload: type.usertype })
      })

      const updateDataLogin = async () => {
        if(type.usertype === 1){
          let imgUrl="";
  
          const timeAt = serverTimestamp()
          // console.log("Login timestamp->", timeAt)
          await updateDoc(doc(db, "users", user.uid), {lastEngagedAt: timeAt})
  
          // const uploadPath = `thumbnails/DefaultExecutive/executive.jpg`
          // const img = ref(storage, uploadPath)
  
          // await getDownloadURL(img)
          // .then((url) => {
          //     console.log("login executive url in getDownLoad->",url)
          //     imgUrl = url
          // })
          // .catch((err) => {
          //     console.log("error in uploading lpgin executive Thumbnail")
          // })
  
          // await updateProfile(user, {photoURL: imgUrl})
          // console.log("In loginnnn... =",user.photoURL)
  
        }
      }

      await updateDataLogin();
      dispatch({ type: 'LOADING', payload: false })
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}