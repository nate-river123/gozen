import React, { useState } from "react";
import axios from "axios";

const LogoCreator = () => {
  const [text, setText] = useState("");
  const [logo, setLogo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/logo", { text });
      setLogo(response.data.logo);
    } catch (error) {
      console.error("Error generating logo", error);
    }
  };

  return (
    <div>
      <h2>Logo Creator</h2>
      <form onSubmit={handleSubmit}>
        <label>Text for Logo:</label>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Generate Logo</button>
      </form>
      {logo && <img src={`data:image/png;base64,${logo}`} alt="Generated Logo" />}
    </div>
  );
};

export default LogoCreator;

