import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from '../../firebase';
import { doc, arrayUnion, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import "./ChatArea.css";
import Compose from "../Compose";
import moment from "moment";
import MessageBubble from "../MessageBubble";
import Sidebar from "../Sidebar";
import { useAuthContext } from "../../hooks/useAuthContext";
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';

const MY_USER_ID = 'apple';

function ChatArea(){

  const bottomListRef = useRef();
  let navigate = useNavigate();
  const { user } = useAuthContext();
  const { chatID } = useParams();

  useEffect(() => {
    const chatDocument = (async() => {
      const docRef = doc(db, 'conversations', chatID);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        if ((docSnap.data().customerID === user.uid) && (docSnap.data().isOpen)) {

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
  },[]);

  const [isLoading, setLoading] = useState(true);
  const [renderMsg, setRenderMsg] = useState(false);
  const [open, setOpen] = useState(false);
  
  const endChat = async() => {
    const docRef = doc(db, 'conversations', chatID);
    await updateDoc(docRef, {
      'isOpen' : false,
    });
  }

  const renderOnce = onSnapshot(doc(db, 'conversations', chatID), (doc) => {
    if (doc.data().isOpen === false) {
      setOpen(true);
      setTimeout(async() => {
        navigate('/');
      }, 3000);
    } else {
      if(!renderMsg){
        let loadMessages = doc.data().messages;
        let temp = [];
        loadMessages.forEach(element => {
          var obj = {
            id: temp.length + 1,
            author: element.isMine? 'apple': 'orange',
            message: element.msg,
            timestamp: new Date().getTime(),
            feedback: element.isFeedback === -1 ? null: (element.isFeedback === 1?'like': 'dislike'),
          };
          temp.push(obj);
          console.log(temp);
          setRenderMsg(true);
          setMessages([...temp])
        });
        console.log(messages);
      }
    }
  });

    useEffect(() => {
    const checkLoading = (async() => {
      const docRef = doc(db, 'conversations', chatID)
      const docGet = await getDoc(docRef);
      if(docGet.exists()) {
        const unsub = onSnapshot(docRef, (docs) => {
            if (docs.data().executiveID === '') {
              setLoading(true);
            } else {
              setLoading(false);
              unsub();
            }
        });
      }
      else {
        console.log("document does not exists->->->")
      }
    })

    checkLoading();
  });


  const [messages, setMessages] = useState([]);

    const addMsg = async(vat)=> {
        const docRef = doc(db, 'conversations', chatID);
        var obj2 = {
          emotion: Math.floor(Math.random()*6),
          msg: vat,
          isFeedback: -1,
          isMine: true, 
          sentTime: new Date().getTime(),
        }
        
        await updateDoc(docRef, {
          "messages": arrayUnion(obj2)
        });
        console.log("added new msg");
        bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
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
          key={i}
          displayName="Executive"
          photoURL="https://firebasestorage.googleapis.com/v0/b/customer-emotion-detection.appspot.com/o/thumbnails%2FDefaultExecutive%2Fexecutive.jpg?alt=media&token=e68739c8-3ead-4ad7-ba82-6b4393028607"
          id={i}
          isMine={isMine}
          feedback={messages[i].feedback}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
          // handleFeedback={handleFeedback}
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
      <Sidebar isChat={true} chatID={chatID} />
      </div>
      {isLoading ?
        <div className="mainbar">
          <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
            <div>
              Looking For an Executive
            </div>
            <i className="fas fa-spinner fa-pulse"></i>
          </div>
        </div>
        :
        <div className="mainbar">
          <Modal
            open={open}
            onClose={()=> setOpen(false)}
            aria-labelledby="modal-modal-title"
          >
            <Box sx={style}>
              <h3 id="modal-modal-title">Chat has ended...<br></br>Redirecting to the Portal</h3>
            </Box>
          </Modal>
          <header>
          {/* {user.photoURL && <Avatar alt={user.displayName} src={user.photoURL}/>}
          {!user.photoURL && <Avatar alt={user.displayName} sx={{ bgcolor: deepPurple[500], width: 45, height: 45 }}>
              {user.displayName[0]}
          </Avatar>} */}
            {user.displayName}
            <span>
              <button className="btn btn-danger endChatbtn" style={{ fontSize: "large" }} onClick={endChat}>End Chat</button>
            </span>
          </header>
          <div className="subspace">
            <div className="message-container">{renderMessages()}</div>
          </div>
          <div ref={bottomListRef} id='scrollTo' />
          <div>
            <Compose
              callback={addMsg}
              position={"absolute"}
            />
          </div>
        </div>
      }
    </div>
  );
}

export default ChatArea;