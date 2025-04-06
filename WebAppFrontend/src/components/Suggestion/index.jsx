import React,{useState} from "react";
import "./Suggestion.css";
import Compose from "../Compose";

function Suggestion(props){
    const[sugText,setSugText]=useState('');
    const[sugText1,setSugText1]=useState('Suggestion1');
    const[sugText2,setSugText2]=useState('Suggestion2');
    const[sugText3,setSugText3]=useState('Suggestion3');

    const handleOnCopy=(text)=>{
        console.log('copyt was clicked');
        setSugText(text);
    }
    return(
        <div className="outcont">
        <div className="container">            
            <div id="sug" className="item"><h4>Suggestion</h4></div>
            <div id="emotion" className="item"><h4>Emotion</h4></div>            
        </div>
        <div className="container2">
            <div className="box"><h3 className="text">{sugText1}</h3><button className="btn btn2" onClick={()=>handleOnCopy(sugText1)}>copy</button></div>
            <div className="box"><h3 className="text">{sugText2}</h3><button className="btn btn2" onClick={()=>handleOnCopy(sugText2)}>copy</button></div>
            <div className="box"><h3 className="text">{sugText3}</h3><button className="btn btn2" onClick={()=>handleOnCopy(sugText3)}>copy</button></div>
        </div>
        <div>
            <Compose 
            suggestedText={sugText}
            callback = {props.callback}
            position = {"fixed"}
            />
        </div>
        </div>
    );
}

export default Suggestion;