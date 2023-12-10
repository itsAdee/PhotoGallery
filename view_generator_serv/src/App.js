import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append('type', 'ImageUploaded')
      formData.append('file', selectedFile);
      formData.append('userID', '123');
      formData.append('imageID', '456');
      formData.append('imageTitle', 'Test image');
      formData.append('photoSize', 1000);

      axios.post('http://localhost:4000/events',
        formData
      ).then((response) => {
        console.log(response.data);
      })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <input type='submit' />
      </form>
    </div>
  );
}

export default App;
