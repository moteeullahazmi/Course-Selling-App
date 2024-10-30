import React, { useState } from "react";
import data from "./data"

export default function Accordion(){
    const [selected,setSelected] = useState(null);

    function handleSingleSelection(getCurrentItem){
        console.log(getCurrentItem)
    }

    return(
        <>
            {
                data && data.length > 0 ? data.map(dataItem => <div 
                onClick={()=>handleSingleSelection(dataItem.id)} className="title">
                    <h3>{dataItem.question}</h3>
                    <span>+</span>
                </div>)
                :<p>No data present</p>
            }
        </>
    )
}