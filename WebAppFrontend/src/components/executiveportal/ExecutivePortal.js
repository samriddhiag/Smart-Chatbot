import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { db, storage } from '../../firebase';
import { doc, collection, query, where, getDocs, getDoc, orderBy, limit, onSnapshot, updateDoc } from "firebase/firestore";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Sidebar from '../Sidebar';
import './ExecutivePortal.css'
import ToggleSwitch from '../Toggleswitch/ToggleSwitch';
import Avatar from '@mui/material/Avatar';
import { ref, getDownloadURL} from "firebase/storage";
import { updateProfile } from "firebase/auth";


export default function ExecutivePortal() {

  const [isChatActive, setChatActive] = useState(false);
  const [chatID, setChatID] = useState('');
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const updatePhoto = async () => {
      let imgUrl = "";

      const uploadPath = `thumbnails/DefaultExecutive/executive.jpg`
      const img = ref(storage, uploadPath)

      await getDownloadURL(img)
      .then((url) => {
          console.log("login executive url in getDownLoad->",url)
          imgUrl = url
      })
      .catch((err) => {
          console.log("error in uploading lpgin executive Thumbnail")
      })

      await updateProfile(user, {photoURL: imgUrl})
      setPhoto(imgUrl)
      // console.log("In loginnnn... =",user.photoURL)
    }

    updatePhoto();
  },[])

  useEffect(() => {
    const getAvailable = (async() => {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef)
      setAvailable(docSnap.data().Available);
      console.log('available->', available)
    })
    getAvailable();
  },[])

  useEffect(() => {
    const getChatActive = (async () => {
      const q = query(collection(db, 'conversations'), where('executiveID', '==', user.uid), where('isOpen', '==', true));
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
  }, [])

  let navigate = useNavigate();
  
  useEffect(() => {
    console.log(available);
    const q = query(collection(db, 'conversations'), where('executiveID', "==", ''), where('isOpen', '==', true),
      orderBy('createdAt'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change.doc.data());
        console.log(change.doc.id);
        isQueued(change.doc.id);
      });
    });

    const isQueued = (async (id) => {
      console.log('isQueued is runnning');
      const q = query(collection(db, 'users'), where('Available', '==', true), orderBy('lastEngagedAt'), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('No Executive Found');
      }
      querySnapshot.forEach((doc) => {
        console.log('Inside the doc');
        console.log(doc.id);
        console.log(user.uid);
        if (doc.id === user.uid) {
          console.log(true);
          updateChat(id);
        } else {
          console.log(false);
        }
      });
    })

    const updateChat = (async(id) => {
      const chatRef = doc(db, 'conversations', id);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(chatRef, {
        executiveID : user.uid
      });
      unsubscribe();
      setOpen(true);
      setTimeout(async() => {
        await updateDoc(userRef, {
          Available : false
        });
      }, 1000);
      setTimeout(async() => {
        navigate('/chat/'+ id);
      }, 4000);
    })

  }, [available])

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

  return (
    <>
    {console.log("First Render in ExecutivePortal->", photo)}
    {photo!=='' && 
    <div className="custApp">
      <div className='leftbar' style={{float: "left"}}>
      <Sidebar isChat={isChatActive} chatID={chatID}/>
      </div>
      <div className="profileImage" style={{float: "right"}}>
        {/* {console.log("First executive portal user.photoURL->", user.photoURL)} */}
        <Avatar alt={user.displayName} src={user.photoURL} sx={{width: 50, height: 50}} />
        <p>Hey {user.displayName}</p>
      </div>
      {!isChatActive ?
        <div>
          <ToggleSwitch available={available} setAvailable={setAvailable} />
          <Modal
            open={open}
            onClose={()=> setOpen(false)}
            aria-labelledby="modal-modal-title"
          >
            <Box sx={style}>
              <h3 id="modal-modal-title">Customer Connected...<br></br>Redirecting to the chat window</h3>
            </Box>
          </Modal>
        </div>

        : <div> Customer Connected .... Chat in Progress !!</div>}
    </div>
    }
    {!photo && 
      <div>
          <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
            <div>
              Loading...
            </div>
            <i className="fas fa-spinner fa-pulse"></i>
          </div>
       </div>
    }
    </>
  )
}
