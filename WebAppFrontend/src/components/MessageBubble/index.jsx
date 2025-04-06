import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, runTransaction, updateDoc } from "firebase/firestore";
import moment from 'moment';
import Emoji from './Emoji';
// import FontAwesomeIcon from './FontAwesomeIcon';
import './MessageBubble.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import Avatar from '@mui/material/Avatar'
import { deepPurple } from '@mui/material/colors';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

export default function MessageBubble(props) {

  const { user } = useAuthContext();

  // const exephotoURL = "https://cdn-icons-png.flaticon.com/512/194/194938.png";
  // const custphotoURL = 'https://cdn-icons-png.flaticon.com/512/194/194917.png';

  const { chatID } = useParams();
    const {
      displayName,
      photoURL,
      data,
      isMine,
      id,
      startsSequence,
      endsSequence,
      showTimestamp,
      isExecutive, 
      feedback,
      emotion,
      // handleFeedback
    } = props;
    const [open, setOpen] = useState(false);
    const [isOpted, setOpted] = useState(feedback===null? false : true);
    const [isDisliked, setDislike] = useState(isOpted === true && feedback === 'dislike'? true : false);
    const friendlyTimestamp = moment(data.timestamp).format('LLLL');
    useEffect(()=>{
      if(props.feedback === null){
        setOpted(false);
      } else {
        setOpted(true);
        setDislike(props.feedback === 'dislike')
      }
    },[props.feedback])

    const handleFeedback = async(event) => {
      event.preventDefault();
      let isLiked = event.currentTarget.id ==='dislike'? 0 : 1;
      let msgId = id;
      
      try {
        const docRef = doc(db, 'conversations', chatID );
        await runTransaction(db, async(transaction)=> {
          const doc = await transaction.get(docRef);
          const newPop = doc.data().messages;
          newPop[msgId].isFeedback = (newPop[msgId].isFeedback === isLiked? -1: isLiked);
          setOpted(true);
          if(isLiked === 0){
            setDislike(true);
          }
          else{
            setDislike(false);
          }
          transaction.update(docRef, {'messages':newPop});
        })
        
      }catch(e){
        console.log(e);
      }
      // console.log(docRef);
      console.log("updated");
        
  }
   const style = {
    position: 'absolute',
    top: '50%',
    left: '70%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
    return (
      <div className={[
        'message',
        
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : isMine ? 'not-start-cust': 'not-start-exe'}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        }

        <div className="bubble-container">
          {/* Avatar for left aligned messages */}
          {startsSequence && !isMine ? 
          (photoURL ?
          <img 
          src={photoURL} 
          alt="Avatar" 
          className="avatar" style={{ margin: "0px", marginRight: "10px", width: 40, height: 40}}>
          </img> 
          :
          <Avatar className="avatar" alt={displayName} sx={{ bgcolor: deepPurple[500], width: 40, height: 40, margin: "0px", marginRight: "10px" }}>{displayName[0]}</Avatar>
          )
          : null
          }


          {/* Executive view only, if customer gives feedback then it shows up in executive window */}
          {isMine && isExecutive && isOpted ? 
            <div>
              <button className='btn feedback-btn' style={{color: 'black'}} id={isDisliked? "dislike":"like"} ><i className= {isDisliked? 'fas fad fa-thumbs-down' : 'fas fad fa-thumbs-up' }></i></button>
            </div> :null
          }
          {isMine && isExecutive ?
                      <div>
                       {/* <i class="fa-solid fa-ellipsis-vertical" onClick={()=>setOpen(true)}></i> */}
                       {/* <i class="fa-solid fa-ellipsis" onClick={()=>setOpen(true)}></i> */}
                      <Button onClick={()=>setOpen(true)} style={{'font-weight':'800'}}>...</Button>
                    <Modal open={open} onClose={()=> setOpen(false)} aria-labelledby="modal-modal-title">
                      <Box sx={style}>
                        <h3 id="modal-modal-title">Suggested texts</h3>
                        <div id="modal-modal-body">
                          <ul>
                            <li>Suggested text1</li>
                            <li>Suggested text2</li>
                            <li>Suggested text3</li>
                          </ul>
                        </div>
                      </Box>
                    </Modal>
                    </div> : null
          }


          
          {/* Data message */}
          <div className="bubble" title={friendlyTimestamp}>
            { data.message }
            {/* <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" /> */}
            {/* <i class="fa-solid fa-ellipsis-vertical" style={{'position':'relative','float':'right'}}></i> */}
          </div>
          {/* Emoji component */}
          {!isMine && isExecutive? <Emoji emotion={emotion}></Emoji>: null}

          {/* Avatar for right aligned messages */}
          {startsSequence && isMine ? 
          (user.photoURL ?
          <img 
          src={user.photoURL} 
          alt="Avatar" className="avatar" style={{margin: "0px", marginLeft: "10px", width: 40, height: 40}}>
          </img>
          :
          <Avatar className="avatar" alt={user.displayName} sx={{ bgcolor: deepPurple[500], width: 40, height: 40, margin: "0px", marginLeft: "10px" }}>{user.displayName[0]}</Avatar>
          )
          : null
          }


          {/* Customer view only, feedback buttons */}
          {!isMine && !isExecutive ? 
          <div className='centralise'>
            <button className='btn feedback-btn' id="dislike" onClick={handleFeedback} style={{color: isOpted && isDisliked?"black":"white"}}>
              <i className="fas fad fa-thumbs-down"></i>
            </button>
          </div> : null}
          {!isMine && !isExecutive ? 
          <div className='centralise'>
            <button className='btn feedback-btn' id='like' onClick={handleFeedback} style={{color: isOpted && !isDisliked? "black":"white"}}>
              <i className="fas fad fa-thumbs-up"></i>
            </button>
          </div> : null}
          
        </div>
      </div>
    );
}