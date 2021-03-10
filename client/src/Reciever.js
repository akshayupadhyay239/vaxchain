import React from "react";

function Reciever(props){
    
    const data = JSON.parse(props.rData)
    return(
        <div>
            <p>{props.id} {data.name} {data.vaccine} {data.age} {data.adhar}</p>
        </div>
        )
}

export default Reciever;