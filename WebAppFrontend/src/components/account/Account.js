import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { auth, db, storage } from '../../firebase'
import Sidebar from '../Sidebar';
import { collection, query, where, getDocs, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import './Account.css'
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar'
import { deepPurple } from '@mui/material/colors';
import { updateProfile } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";

export default function Account({ type }) {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(user.displayName)
    const [thumbnail, setThumbnail] = useState('')
    const [thumbnailError, setThumbnailError] = useState(null)
    const [isChatActive, setChatActive] = useState(false);
    const [chatID, setChatID] = useState('');

    useEffect(() => {
        const getChatActive = (async () => {
            let q;
            if(type === 0)
                q = query(collection(db, 'conversations'), where('customerID', '==', user.uid), where('isOpen', '==', true));
            else
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

    const handlePhotoSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        let imgUrl = ""
        if(thumbnail){
            // console.log("thumbnail->", thumbnail)
            if(user.photoURL){
                let str = user.photoURL
                let curPhoto = str.slice(
                    str.indexOf("2F") + 2,
                    str.lastIndexOf('?'),
                );
                // console.log("curphoto Name ->", curPhoto)
                curPhoto = curPhoto.substring(curPhoto.indexOf("2F")+2)  
                // console.log("curphoto Name ->", curPhoto)
                const path = `thumbnails/${user.uid}/${curPhoto}`
                const image = ref(storage, path)

                deleteObject(image).then(() => {
                    console.log("successfully deleted the url in storage")
                }).catch((error) => {
                    console.log("error in deleting file from storage")
                });
            }

            const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`
            const img = ref(storage, uploadPath)

            await uploadBytes(img, thumbnail)
            .then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });

            // now img.ref gives us the path and getDownloadURL creates a URL in firebase storage and return it. 
            await getDownloadURL(img)
            .then((url) => {
                console.log("url in getDownLoad->",url)
                imgUrl = url
            })
            .catch((err) => {
                console.log("error in uploading Thumbnail")
            })

            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                photoURL : imgUrl
            });

            await updateProfile(user, {photoURL: imgUrl})

        }

        setLoading(false)
    }

    const handleFileChange = (event) => {

        setThumbnail(null) 
    
        let selected = event.target.files[0] 
    
        // console.log(selected)
    
        // If no file is being selected (for ex - if one user selects an image then again cancels it, then selected will be null)
        if(!selected) {
          setThumbnailError('Please select a file')
          return
        }
    
        // if the type of the file is not an image file (i.e if there are audio, video files)
        if(!selected.type.includes('image')){
          setThumbnailError('Selected file must be an image file')
          return
        }
    
        if(selected.size > 1500000){
          setThumbnailError('Image file size must be less than 1500kb')
          return
        }
    
        //Now if user has correctly chosen the file
        setThumbnailError(null)
        setThumbnail(selected)
        console.log('thumbnail update')
      } 

   const handleName = (event) => {
       setName(event.target.value)
   } 

   const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
            displayName : name
        });
        await updateProfile(user, {displayName: name})
        setLoading(false)
    }

  return ( 
    <>  
    {!loading && 
    <>  
    <div className='leftbar' style={{float: "left"}}>
      <Sidebar isChat={isChatActive} chatID={chatID}/>
    </div>
    <div className="bodyColor">
    {/* <!-- Account page navigation--> */}
    {/* <nav class="nav nav-borders">
        <a class="nav-link active ms-0" href="https://www.bootdey.com/snippets/view/bs5-edit-profile-account-details" target="__blank">Profile</a>
        <a class="nav-link" href="https://www.bootdey.com/snippets/view/bs5-profile-billing-page" target="__blank">Billing</a>
        <a class="nav-link" href="https://www.bootdey.com/snippets/view/bs5-profile-security-page" target="__blank">Security</a>
        <a class="nav-link" href="https://www.bootdey.com/snippets/view/bs5-edit-notifications-page"  target="__blank">Notifications</a>
    </nav> */}
    <hr className="mt-0 mb-4" />
    <div className="row">
        <div className="col-xl-4">
            {/* <!-- Profile picture card--> */}
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                    {/* <!-- Profile picture image--> */}
                    {user.photoURL && <Avatar alt={user.displayName} src={user.photoURL} sx={{ width: 300, height: 300 }} />}
                    {!user.photoURL && <Avatar alt={user.displayName} sx={{ bgcolor: deepPurple[500], width: 300, height: 300, fontSize: "220px" }}>
                        {user.displayName[0]}
                    </Avatar>}
                    {/* <!-- Profile picture help block--> */}
                    {type===0 && 
                    <form onSubmit={handlePhotoSubmit}>
                    <div className="small font-italic text-muted mb-4">Size no larger than 1.5 MB</div>
                    {/* <!-- Profile picture upload button--> */}
                    <label>
                        <span>Profile Photo:</span>
                        <input 
                        required
                        type="file"  // img file which the user will choose to upload his/her thumbnail
                        onChange={handleFileChange}  // This onChange is triggered when the user selects a file or remove it
                        />
                        {thumbnailError && <div className='error'>{thumbnailError}</div>}
                    </label>
                    <button className="btn btn-primary" type="submit">Upload new image</button>
                    </form>
                    }
                </div>
            </div>
        </div>
        <div className="col-xl-8">
            {/* <!-- Account details card--> */}
            <div className="card mb-4" style={{fontSize: "18px"}}>
                <div className="card-header">Account Details</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* <!-- Form Group (username)--> */}
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputUsername">Display Name</label>
                            <input className="form-control" id="inputUsername" type="text" placeholder="Enter your username" onChange={handleName} value={name} />
                        </div>
                        {/* <!-- Form Group (email address)--> */}
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputEmailAddress">Email address (cannot be changed)</label>
                            <input className="form-control" id="inputEmailAddress" type="email" placeholder={user.email} />
                        </div>
                        {/* <!-- Form Row--> */}
                        <div className="row gx-3 mb-3">
                            {/* <!-- Form Group (phone number)--> */}
                            {/* <!-- Form Group (birthday)--> */}
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputBirthday">User Type (cannot be changed)</label>
                                <input className="form-control" id="inputBirthday" type="text" name="birthday" placeholder={type===0 ? "Customer" : "Executive"} />
                            </div>
                        </div>
                        {/* <!-- Save changes button--> */}
                        <button className="btn btn-primary" type="submit">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</>
}
{loading && 
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
