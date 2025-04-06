import React, { useState, useEffect} from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { storage } from '../../firebase';
import Avatar from '@mui/material/Avatar'
import Sidebar from '../Sidebar';
import AssignRoles from '../AsssignRoles/AssignRoles';
import { ref, getDownloadURL} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import './AdminPortal.css'

export default function AdminPortal() {
    const { user } = useAuthContext();
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        const updatePhoto = async () => {
          let imgUrl = "";
    
          const uploadPath = `thumbnails/DefaultAdmin/Admin.jpeg`
          const img = ref(storage, uploadPath)
    
          await getDownloadURL(img)
          .then((url) => {
              console.log("login admin url in getDownLoad->",url)
              imgUrl = url
          })
          .catch((err) => {
              console.log("error in uploading lpgin admin Thumbnail")
          })
    
          await updateProfile(user, {photoURL: imgUrl})
          setPhoto(imgUrl)
          // console.log("In loginnnn... =",user.photoURL)
        }
    
        updatePhoto();
    }, [])
    
  return (
      <>
    {photo === '5' ? 
      <div>
          <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
            <div>
              Loading...
            </div>
            <i className="fas fa-spinner fa-pulse"></i>
          </div>
       </div>
    : <div className="custApp">
    <div className='leftbar' style={{float: "left"}}>
      <Sidebar />
    </div>
    <div className='mainbar'>
      <div className="profileImage" style={{float: "right"}}>
          <Avatar alt={user.displayName} src={user.photoURL}/>
          <p>Hey Admin {user.displayName}</p>
      </div>
      <AssignRoles />
    </div>
              </div>
          }
    
    </>
  )
}
