import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, runTransaction, updateDoc } from "firebase/firestore";
import moment from 'moment';
import Emoji from './HistoryEmoji';
import './HistoryBubble.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import Avatar from '@mui/material/Avatar'
import { deepPurple } from '@mui/material/colors';

export default function HistoryBubble(props) {

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
            <div className='centralise'>
              <button className='btn feedback-btn' style={{color: 'black'}} id={isDisliked? "dislike":"like"} ><i className= {isDisliked? 'fas fad fa-thumbs-down' : 'fas fad fa-thumbs-up' }></i></button>
            </div> :null
          }

          
          {/* Data message */}
          <div className="bubble" title={friendlyTimestamp}>
            { data.message }
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
            <button className='btn feedback-btn' id="dislike" style={{color: isOpted && isDisliked?"black":"white"}}>
              <i className="fas fad fa-thumbs-down"></i>
            </button>
          </div> : null}
          {!isMine && !isExecutive ? 
          <div className='centralise'>
            <button className='btn feedback-btn' id='like' style={{color: isOpted && !isDisliked? "black":"white"}}>
              <i className="fas fad fa-thumbs-up"></i>
            </button>
          </div> : null}
          
        </div>
      </div>
    );
}