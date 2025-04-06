import { createContext, useReducer, useEffect } from 'react';
import { db, auth } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        case 'AUTH_IS_READY':
            return { ...state, user: action.payload, authIsReady: true}
        case 'TYPE':
            return { ...state, type: action.payload}
        case 'AVAILABLE':
            return { ...state, currentAvailable: action.payload }
        case 'LOADING':
            return { ...state, loading: action.payload}
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {

    const getType = async (type, load, user) => {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
    
        if(docSnap.exists()){
            type.usertype = docSnap.data().userType
            load.loading = false
        }
        else{
          console.log("No document with such user credentials exists")
        }
    
        if(user)
          console.log("user->id", user.uid, "type->", type.usertype)
    
      }

    const getAvailable = async (available, user) => {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        const recent = docSnap.data().Available
        console.log("in AuthContext recent Available-> ", recent)
        available.avail = recent
    }

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        type: 0,
        currentAvailable: false,
        authIsReady: false,
        loading: true,
    })

    useEffect(() => {
        let type = { usertype: 0 }
        let available = { avail: false }
        let load = { loading: true}

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            load.loading = true;
            dispatch( { type: 'AUTH_IS_READY', payload: user } )
            await getType(type, load, user)
            console.log("useEffect AuthContext ", type.usertype)
            console.log(" useeffect loading", load.loading)
            await getAvailable(available, user)
            dispatch({ type: 'TYPE', payload: type.usertype })
            dispatch({ type: 'LOADING', payload: load.loading })
            dispatch( {type: 'AVAILABLE', payload: available.avail} )
        })
        
        unsubscribe()
        
    }, [])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}
