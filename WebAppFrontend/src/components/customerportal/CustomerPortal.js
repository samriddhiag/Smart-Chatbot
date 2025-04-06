import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import Sidebar from '../Sidebar';
import './CustomerPortal.css'
import Avatar from '@mui/material/Avatar'
import { deepPurple } from '@mui/material/colors';


export default function CustomerPortal() {

  const [isChatActive, setChatActive] = useState(false);
  const [chatID, setChatID] = useState('');
  const { user } = useAuthContext();

  useEffect(() => {
    const getChatActive = (async () => {
      const q = query(collection(db, 'conversations'), where('customerID', '==', user.uid), where('isOpen', '==', true));
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

  let navigate = useNavigate();

  const startChat = (async () => {

    const docData = {
      'customerID': user.uid,
      'executiveID': '',
      isOpen : true,
      createdAt : serverTimestamp(),
      messages: [],
    };

    const docRef = await addDoc(collection(db, 'conversations'), docData);

    navigate('/chat/' + docRef.id);
  })

  const continueChat = (() => {
    navigate('/chat/' + chatID);
  })

  const handleClick = (async () => {

    const chatRef = doc(db, 'conversations', chatID);
    await updateDoc(chatRef, {
        isOpen : false
    });

    await startChat();
  })
  
  // document.getElementsByClassName("navbar").style.padding = "0px";
  // d.className += "visibilityAdder";

  return (
    <div className="custApp">
      <div className='leftbar' style={{float: "left"}}>
      <Sidebar isChat={isChatActive} chatID={chatID}/>
      </div>
      <div className="profileImage" style={{float: "right"}}>
        {/* <ProfileImage src={user.photoURL}/> */}
        {/* {console.log("value of user.photoURL === ",user.photoURL)} */}
        {user.photoURL && <Avatar alt={user.displayName} src={user.photoURL}/>}
        {!user.photoURL && <Avatar alt={user.displayName} sx={{ bgcolor: deepPurple[500], width: 45, height: 45 }}>
            {user.displayName[0]}
        </Avatar>}
        <p>Hey {user.displayName}</p>
      </div>
      {isChatActive ? 
        <div>
          Your chat is still in progress..
          <button onClick={continueChat}>Continue to the chat</button>
          <button onClick={handleClick}>Start a new chat</button>
      </div>
      : 
        <button onClick={startChat}>Start a chat</button>
      }
    </div>
  )
}
