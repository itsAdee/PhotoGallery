import React from 'react';
import "./css/styles.css";

function ImageCard(props) {
  return (
    <div className="image-container">
        <img src={props.imageUri} alt={props.imageName} />
        
        <button onClick={() => props.onDelete(props.id)}><img src={require("./images/delete.png")} alt="delete icon" style={{width: "20px", cursor: "pointer"}}/></button>
    </div>
  )
}

export default ImageCard