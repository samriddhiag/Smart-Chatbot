import React from "react";
import { Link } from 'react-router-dom'
import "./Sidebar.css";
import { useLogout } from '../../hooks/useLogout';

function Sidebar({isChat, chatID}){
    const { logout, isPending } = useLogout();
    return (
        <div style={{backgroundColor: "#222222", height: "100vh"}}>
            {/* <h1>Sidebar</h1> */}
            <div className="sidebar">
                <h4><i className="fas fa-comments" style={{color: "white"}}></i> WellsFargo</h4>
                <ul>
                    <li className="btn btn-link"><Link to='/'><span className="spanner"><i className="fas fa-user" style={{width: "40px"}}></i>Portal</span></Link></li>
                    { isChat && 
                        <li className="btn btn-link"><Link to={"/chat/" + chatID}><span className="spanner"><i className="fas fa-comment" style={{ width: "40px" }}></i>Chat</span></Link></li>
                    }
                    <li className="btn btn-link"><Link to="/account"><span className="spanner"><i className="fas fa-user" style={{width: "40px"}}></i>Account</span></Link></li>
                    <li className="btn btn-link"><span className="spanner"><i className="fas fa-cog" style={{width: "40px"}}></i>Settings</span></li>
                    <li className="btn btn-link"><Link to="/history"><span className="spanner"><i className="fas fa-user" style={{width: "40px"}}></i>Chat History</span></Link></li>
                    <li className="btn btn-link" onClick={logout}><span className="spanner"><i className="fas fad fa-power-off" style={{width: "40px"}}></i>Logout</span></li>
                </ul> 
            </div>
        </div>
    );
}

export default Sidebar;