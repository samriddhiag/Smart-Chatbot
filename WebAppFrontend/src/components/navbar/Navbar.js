import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

import './Navbar.css'

export default function Navbar() {

  const { user } = useAuthContext()

  console.log("Navbar user", user)

  return (
    <div className='navbar'>
    {!user && (
      <div className='inner-navbar'>
        <ul className='space'>
            
             <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
             </>
            
        </ul>
      
        {/* {user && (
          <>
            <li>
                {isPending && <button className='btn' disabled>Logging Out...</button>}
                {!isPending && <button className='btn' onClick={logout}>Logout</button>}
            </li>
          </>
        )} */}
        </div>
        )}
    </div>
  )
}
