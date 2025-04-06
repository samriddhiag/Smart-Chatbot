import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { auth, db, storage } from '../../firebase'
import Sidebar from '../Sidebar';
import { collection, query, where, getDocs, getDoc , orderBy, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar'
import { deepPurple } from '@mui/material/colors';
import { updateProfile } from 'firebase/auth';
import './ExecutiveHistory.css'
import { useNavigate } from 'react-router-dom';

export default function ExecutiveHistory() {

    const { user } = useAuthContext();
    const [isChatActive, setChatActive] = useState(false);
    const [chatID, setChatID] = useState('');
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState([])
    let navigate = useNavigate();

    useEffect(() => {

        const getChatActive = (async () => {
            let q;
            q = query(collection(db, 'conversations'), where('executiveID', '==', user.uid), where('isOpen', '==', true));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                setChatActive(true);
                setChatID(doc.id);
            });
            } else {
            setChatActive(false);
            }

        });

        getChatActive();
    })  

    useEffect(() => {

        const getExeCusName = async (docId) => {
            const userRef = doc(db, 'users', docId)
            const docSnap = await getDoc(userRef)
            return (docSnap.data().displayName)
        }

        const getDocuments = async () => {
            setLoading(true)
            const q = query(collection(db, 'conversations'), where('executiveID', '==', user.uid), where('isOpen', '==', false), orderBy('createdAt','desc'));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    console.log(doc.id, " => ", doc.data());
                    const cusName = await getExeCusName(doc.data().customerID)
                    const newValue = {...doc.data(), displayName: cusName , id: doc.id}
                    setDocuments((prevValue) => {
                        return [...prevValue, newValue]
                    })
                });
            } 
            // result.forEach((ele) => {
            //     console.log("result CreatedAt->", ele.isOpen)
            // })
            // setDocuments(result)
            setLoading(false)
        }

        getDocuments()
    },[])

    return (
        <>
        {!documents && <h1>Loading...</h1>}
        {documents && 
        <div>
            <div className='leftbar' style={{float: "left"}}>
                <Sidebar isChat={isChatActive} chatID={chatID}/>
            </div>
            <h1>Chat history for {user.displayName}</h1>
            {console.log("documents length",documents.length)}
            <div className="transactions">
            <ul className="subspace">
                {documents && documents.map((chatDoc) => {
                    return (
                        <li key={chatDoc.id}>
                            <button className="view" onClick={() => {
                                navigate("/history/" + chatDoc.id)
                            }}>View</button>
                            <p className="name">Chat ID: {chatDoc.id}</p>
                            <p className="ExeName">Customer Assigned: {chatDoc.displayName}</p>
                            <p className="amount">Time: {chatDoc.createdAt.toDate().toDateString()} {chatDoc.createdAt.toDate().toLocaleTimeString('en-US')}</p>
                            {/* <button className="cancel" onClick={() => {
                                alert(`Do you Want to Delete this chat history`);
                            } }>X</button> */}
                        </li>
                    );
                })}
            </ul>
           </div>
        </div>
        }
      </>
    )
}
