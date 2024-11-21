import React, { useState } from "react";
import axios from "axios";

const BannerCreator = () => {
  const [text, setText] = useState("");
  const [banner, setBanner] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/banner", { text });
      setBanner(response.data.banner);
    } catch (error) {
      console.error("Error generating banner", error);
    }
  };

  return (
    <div>
      <h2>Banner Creator</h2>
      <form onSubmit={handleSubmit}>
        <label>Text for Banner:</label>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Generate Banner</button>
      </form>
      {banner && <img src={`data:image/png;base64,${banner}`} alt="Generated Banner" />}
    </div>
  );
};

export default BannerCreator;


