import React,{useEffect} from "react";
import "./Compose.css";


function Compose(props){
    function handleClick(event){
        // event.preventDefault();
        var vat = document.getElementById('msgid').value;
        console.log(vat);
        if(vat.length!==0){props.callback(vat);}
        document.getElementById('msgid').value = "";
        // bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
        const scroller = document.querySelector(".subspace");
        scroller.scrollTo({top: scroller.scrollHeight, behavior: "smooth"});
    }

    useEffect(()=>{
        if(props.suggestedText)
        {
            document.getElementById('msgid').value=props.suggestedText;
        }
    },[props.suggestedText])
    return (
        
            <div className="compose" style={{position: props.position}}>
                <div className="text-inline">
                <input 
                    type="text"
                    id="msgid"
                    className="compose-input"
                    placeholder="Type Something...."
                    onSubmit={handleClick}
                    // value={""}
                    // onChange={handler}
                />
                </div>
                <div className="text-sender">
                    <button className="btn btn-lg" type="submit" onClick= {handleClick}><i className="fas fad fa-paper-plane"></i></button>
                </div>
            
            </div>
    );
}

export default Compose;