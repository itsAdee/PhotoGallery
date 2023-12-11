import React from 'react';
import "./css/styles.css";

function ImageCard(props) {
  return (
    <div className="image-container">
        <img src={props.imageUri} alt="some image" />
        <img src={require("./images/delete.png")} alt="delete image" style={{width: "20px", cursor: "pointer"}}/>
    </div>
  )
}

export default ImageCard