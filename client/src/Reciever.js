import React from "react";

function Reciever(props){
    
    const data = JSON.parse(props.rData)
    return(
        <div className="record">
            <p>Name   : {data.name}</p>
            <p>Vaccine: {data.vaccine}</p>
            <p>Age    : {data.age}</p>
            <p>Aadhar : {data.adhar}</p>
        </div>
        )
}

export default Reciever;