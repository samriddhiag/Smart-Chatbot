import { useState } from 'react'
import { useRegister } from '../../hooks/useRegister'

import './Register.css'

export default function Register() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [thumbnail, setThumbnail] = useState(null) 
    const [thumbnailError, setThumbnailError] = useState(null) 
    const { register, isPending, error } = useRegister() 
  
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("password: ", password, " confirmPassword: ", confirmPassword)
        register(email, password, confirmPassword, displayName, thumbnail)
        // if(password === confirmPassword){
        //     register(email, password, displayName)
        // }
        // else{
        //     console.log("password donot match")
        // }
    }  

    const handleFileChange = (event) => {
        setThumbnail(null) 
    
        let selected = event.target.files[0] 
    
        console.log(selected)
    
        if(!selected) {
          setThumbnailError('Please select a file')
          return
        }
    
        if(!selected.type.includes('image')){
          setThumbnailError('Selected file must be an image file')
          return
        }
    
        if(selected.size > 1500000){
          setThumbnailError('Image file size must be less than 1500kb')
          return
        }
    
        setThumbnailError(null)
        setThumbnail(selected)
        console.log('thumbnail update')
      
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        <label>
            <span>Display Name</span>
            <input
            required
            type="text" 
            onChange={(event) => setDisplayName(event.target.value)} 
            value={displayName}
            />
        </label>
        <label>
            <span>Email</span>
            <input
            required 
            type="email" 
            onChange={(event) => setEmail(event.target.value)} 
            value={email}
            />
        </label>
        <label>
            <span>Password</span>
            <input
            required
            type="password" 
            onChange={(event) => setPassword(event.target.value)} 
            value={password}
            />
        </label>
        <label>
            <span>Confirm Password</span>
            <input
            required
            type="password" 
            onChange={(event) => setConfirmPassword(event.target.value)} 
            value={confirmPassword}
            />
        </label>
        <label>
            <span>Profile Image:</span>
            <input 
            type="file" 
            onChange={handleFileChange}
            />
            {thumbnailError && <div className='error'>{thumbnailError}</div>}
        </label>
        {!isPending && <button className='btn'>Register</button>} 
        {isPending && <button className='btn' disabled>Loading...</button>} 
        {error && <div className='error'>{error}</div>}
        </form>
    )
}
