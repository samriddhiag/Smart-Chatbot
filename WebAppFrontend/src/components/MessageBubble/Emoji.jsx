import React from "react";

export default function Emoji(props){
    console.log(props.emotion);
    const emojiList = ['😃', '😭', '❤️', '😡', '😐', '🐒'];
    return(
        <div style={{textAlign: "center", padding: "10px", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <span  role="img" aria-label="dog" style={{fontSize:"medium"}}>{emojiList[props.emotion]}</span>
        </div>
    );
}