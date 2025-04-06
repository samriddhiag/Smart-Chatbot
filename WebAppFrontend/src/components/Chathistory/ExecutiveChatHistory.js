import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from '../../firebase'
import { query, collection, getDocs, where, doc, arrayUnion, updateDoc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import "./ExecutiveChatHistory.css";
import Suggestion from "../Suggestion";
import moment from "moment";
import MessageBubble from "../MessageBubble";
import Sidebar from "../Sidebar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Avatar } from "@mui/material";
import { deepPurple } from '@mui/material/colors';

const MY_USER_ID = 'apple';

function ExecutiveChatArea() {
  
  let navigate = useNavigate();
  const { user } = useAuthContext();
  const [isChatActive, setChatActive] = useState(false);
  const [chatIDCurrent, setChatIDCurrent] = useState('');
  const { chatID } = useParams();
  const [customerName, setCustomer] = useState('')
  const [customerURL, setCustomerURL] = useState("")

  useEffect(() => {

        const getChatActive = (async () => {
            let q;
            q = query(collection(db, 'conversations'), where('executiveID', '==', user.uid), where('isOpen', '==', true));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                setChatActive(true);
                setChatIDCurrent(doc.id);
            });
            } else {
            setChatActive(false);
            }

        });

        getChatActive();
    })  
  
    useEffect(() => {
      const chatDocument = (async() => {
        const docRef = doc(db, 'conversations', chatID);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if ((docSnap.data().executiveID === user.uid)) {
            const customerRef = doc(db, 'users', docSnap.data().customerID);
            const customerSnap = await getDoc(customerRef);
            setCustomer(customerSnap.data().displayName);
            setCustomerURL(customerSnap.data().photoURL);
          }else{
            navigate('/');
          }
        }
        else {
          console.log('document doesnot exist');
          navigate('/');
        }
      })
  
      chatDocument();
    },[customerName]);
    
  const [messages, setMessages] = useState([])
  const [renderMsg, setRenderMsg] = useState(false);
  const [open, setOpen] = useState(false);
  
  const renderOnce = onSnapshot(doc(db, 'conversations', chatID), async(document) => {
        if(!renderMsg){
          let loadMessages = document.data().messages;
          let temp = [];
          loadMessages.forEach(element => {
            var obj = {
              id: temp.length + 1,
              author: element.isMine? 'orange': 'apple',
              message: element.msg,
              timestamp: new Date().getTime(),
              feedback: element.isFeedback === -1 ? null: (element.isFeedback === 1?'like': 'dislike'),
              emotion: element.emotion,
            };
            temp.push(obj);
            console.log(temp);
            setRenderMsg(true);
            setMessages([...temp])
          });
        }
  });
    
    // const getMessages = () => {
    //      setMessages([...messages, ...tempMessages])
    //  }
     useEffect(() => {
        if(messages.length === 0){
            renderOnce();
        }
    });

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  
  const renderMessages = () => {

    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.sentTime);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.sentTime);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.sentTime);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <MessageBubble
          displayName = {customerName}
          photoURL = {customerURL}
          key={i}
          id={i}
          isMine={isMine}
          feedback={messages[i].feedback}
          emotion={messages[i].emotion}
          isExecutive={true}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
          // handlefeedback={()=>{console.log("clicked from executive side");}}
        />
      );

      // Proceed to the next message.
      i += 1;
    }
    // getMessages();
    return tempMessages;
  }

    return (
      <div className="custApp">
        <div className='leftbar' style={{float: "left"}}>
            <Sidebar isChat={isChatActive} chatID={chatIDCurrent}/>
        </div>  
        <div className="mainbar">
            <header>
            {/* <Avatar alt={user.displayName} src={user.photoURL} sx={{width: 45, height: 45}}/> */}
            {user.displayName}
            {/* {customerURL && <Avatar className="photo" alt={user.displayName} src={user.photoURL}/>}
            {!customerURL && <Avatar className="photo" alt={user.displayName} sx={{ bgcolor: deepPurple[500], width: 41, height: 41 }}>
              {customerName[0]}
            </Avatar>} */}
              <h2 className="custID">{ customerName }</h2>
            </header>
            <div className="subspace">
                <div className="message-container">{renderMessages()}</div>
            </div>
            
        </div>
      </div>
    );
}

export default ExecutiveChatArea;