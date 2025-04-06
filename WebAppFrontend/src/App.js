import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';  
import './App.css';
import Navbar from './components/navbar/Navbar';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import CustomerPortal from './components/customerportal/CustomerPortal';
import ExecutivePortal from './components/executiveportal/ExecutivePortal';
import AdminPortal from './components/adminportal/AdminPortal';
import ChatArea from './components/ChatArea';
import ExecutiveChatArea from './components/ExecutiveChatArea';
import Account from './components/account/Account';
import History from './components/history/History';
import ChatHistory from './components/Chathistory/ChatHistory';
import ExecutiveHistory from './components/Executivehistory/ExecutiveHistory'
import ExecutiveChatHistory from './components/Chathistory/ExecutiveChatHistory'

function App() {

  const {user, type, loading, authIsReady} = useAuthContext();

  // console.log("type->",type)

  return (
    <div className="App">
    {authIsReady && (
      <BrowserRouter>
      {/* <div className='container' style={{width: "2000px"}}> */}
        <Navbar />
        <Routes>
          {console.log("Is this first?")}
            <Route path="/" element={ user ? loading ? 
            <div>
            <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
              <div>
                Loading...
              </div>
              <i className="fas fa-spinner fa-pulse"></i>
            </div>
         </div> : ((type === 0) ? <CustomerPortal /> : (type === 1) ? <ExecutivePortal /> : <AdminPortal />) : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/chat/:chatID" element={user ? loading ? 
            <div>
            <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
              <div>
                Loading...
              </div>
              <i className="fas fa-spinner fa-pulse"></i>
            </div>
         </div> : (type===0) ? <ChatArea /> : <ExecutiveChatArea userName = {user.displayName}/> : <Navigate to="/login" />} />
          <Route path="/account" element={user ? loading ? 
            <div>
            <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
              <div>
                Loading...
              </div>
              <i className="fas fa-spinner fa-pulse"></i>
            </div>
         </div> : <Account type={type} /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? loading ? 
            <div>
            <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
              <div>
                Loading...
              </div>
              <i className="fas fa-spinner fa-pulse"></i>
            </div>
         </div> : (type===0) ? <History /> : <ExecutiveHistory /> : <Navigate to="/login" />} />
          <Route path="/history/:chatID" element={user ? loading ? 
            <div>
            <div style={{ 'fontSize': '40px', 'marginTop': '250px' }}>
              <div>
                Loading...
              </div>
              <i className="fas fa-spinner fa-pulse"></i>
            </div>
         </div> : (type===0) ? <ChatHistory /> : <ExecutiveChatHistory /> : <Navigate to="/login" />} />
        </Routes>
      {/* </div>   */}
      </BrowserRouter>
      )}
    </div>
  );
}

export default App;
