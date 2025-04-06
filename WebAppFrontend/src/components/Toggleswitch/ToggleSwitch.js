import { db } from '../../firebase';
import { doc, runTransaction } from "firebase/firestore";
import { useAuthContext } from '../../hooks/useAuthContext';
import './ToggleSwitch.css';

const ToggleSwitch = ({available, setAvailable}) => {
  const { user, currentAvailable } = useAuthContext();
  console.log("availableStatus->", currentAvailable)

  const handleClick = (async () => {
    // tempAvailable = !tempAvailable
    console.log('click event ran');
    // console.log('tempAvailable->', tempAvailable);
    // setAvailable(tempAvailable);
    const docRef = doc(db, 'users', user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        const newStatus = !sfDoc.data().Available;
        setAvailable(newStatus);
        transaction.update(docRef, { Available: newStatus });
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
    // await updateDoc(doc(db, 'users', user.uid), { Available: tempAvailable });
  })

  return (
    <div style={{padding: "30px"}}>
      <h1>Available</h1>  
        <label className="switch react-switch-label" >
          <input type="checkbox" 
            className="btn btn-checkbox"
            id={`react-switch-new`}
            // type="checkbox"
            checked={available}
            onChange={handleClick}
          />
          <span className="slider round"></span>
        </label>
    </div>
  );
};

export default ToggleSwitch;
