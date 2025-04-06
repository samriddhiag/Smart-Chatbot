import { useState } from 'react'
import { db} from '../../firebase';
import { doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import './AssignRoles.css'

export default function AssignRoles() {
    const [searchValue, setSearch] = useState('');
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(0);
    const [pending, setPending] = useState(false);
    const [isResult, setResult] = useState(false);

    const handleSearch = async() => {
    const q = query(collection(db, 'users'), where('emailID', '==', searchValue));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('No Executive Found');
          setID('');
      }
      querySnapshot.forEach((doc) => {
        console.log('Inside the doc');
          console.log(doc.id);
          console.log(doc.data());
          setID(doc.id);
          setName(doc.data().displayName);
          setEmail(doc.data().emailID);
          setRole(doc.data().userType);
      });
      setResult(true);
    }

    const handleRole = async () => {
        setPending(true);
        await updateDoc(doc(db, "users", id), { userType: role });
        setPending(false);
    }

  return (
      <>
      <div style={{
        'display': 'flex',
        'flexDirection': 'column',
        'alignItems': 'center',
        'justifyContent': 'center',
        'marginTop': '40px',
      }}>
        <h2>Assign Roles</h2>
        <div className="assign">
          <div className="text-inline">
            <input 
              type="email"
              id="msgid"
              className="assign-input"
              placeholder="Search a user...."
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sender">
            <button className="btn-lg" onClick={handleSearch}><i className="fa fa-search"></i></button>
          </div>
        </div>
        <Card variant="outlined"
              style={{
                  'padding': '20px',
                'minHeight': '80px',
                  'minWidth': '600px',
                  'display': 'flex',
                  'alignItems': 'center',
                  'justifyContent': 'center',
              }}
          >
              {(!isResult) ?
                <h5>
                   Search in the bar above to assign any role to a user
                </h5>  : (id === '') ?
                <h5>
                  No Users Found
                </h5> : 
                <div>
                    <h5>Name - {name}</h5>
                      <h5> Email - {email}</h5>
                      <FormControlLabel control={<Radio
                        checked={role === 0}
                        onChange={() => setRole(0)}
                        value={0}
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'Customer' }}
                      />} label="Customer" />
                      <FormControlLabel control={<Radio
                        checked={role === 1}
                        onChange={() => setRole(1)}
                        value={1}
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'Executive' }}
                      />} label="Executive" />
                      <FormControlLabel control={<Radio
                        checked={role === 2}
                        onChange={() => setRole(2)}
                        value={2}
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'Admin' }}
                      />} label="Admin" />
                      <div>
                      {!pending && <button className='btn' onClick={handleRole}>Set</button>}
                      {pending && <button className='btn' disabled>Setting...</button>}
                      </div>
                </div>
              }
          </Card>
      </div>
          
    </>
  )
}
