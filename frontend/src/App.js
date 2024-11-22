import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css"; // Create this file for styling

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="logo">GoZen</div>
        </header>
        <Routes>
          {/* Set up Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/social-posters" element={<RemoveBackgroundPage />} />
          <Route path="/logo-maker" element={<LogoMakerPage />} />
        </Routes>
      </div>
    </Router>
  );
};

const Card = ({ imgSrc, title, navigateTo }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="card" onClick={() => navigate(navigateTo)}>
        <img src={imgSrc} alt={title} className="card-img" />
      </div>
      <div className="card-text">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

const HomePage = () => (
  <main className="main">
    <h1>
      Design <span className="highlight">anything</span> like a pro
    </h1>
    <div className="cards">
      {/* <Card imgSrc="path-to-remove-bg.jpg" title="Remove Background" /> */}
      <Card
        imgSrc="https://img.freepik.com/premium-vector/burger-restaurant-logo-vector-template_621660-2613.jpg?w=1480"
        title="Logo Maker"
        navigateTo="/logo-maker"
      />
      <Card
        imgSrc="https://mir-s3-cdn-cf.behance.net/projects/404/99fcc8210697073.6716372a5972d.jpg"
        title="Social Posters"
        navigateTo="/social-posters"
      />
    </div>
  </main>
);

const LogoMakerPage = () => {
  const [brandName, setbrandName] = useState("");
  const [bestSellerItem, setbestSellerItem] = useState("");
  const [isLoading, setIsLoading] = useState(false); // To manage loading state
  const [imageUrls, setImageUrls] = useState([]); // State to store image URLs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    // await sleep(3000); // Simulate a 3 second delay

    const requestBody = {
      brand_name: brandName,
      best_seller_item: bestSellerItem,
    };

    // Simulate an API call (replace with your actual API call)
    try {
      const response = await fetch("http://localhost:5001/api/logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      console.log("API Response:", result);

      // Assuming the API returns {urls: []}
      if (result.urls) {
        setImageUrls(result.urls); // Update state with image URLs
      }
    } catch (error) {
      // const urls = [
      //   "https://b.stablecog.com/2685ab26-dffb-4c10-9e10-b6ffb4932cd5.jpeg",
      //   "https://b.stablecog.com/2685ab26-dffb-4c10-9e10-b6ffb4932cd5.jpeg",
      //   "https://b.stablecog.com/2685ab26-dffb-4c10-9e10-b6ffb4932cd5.jpeg",
      // ];
      // setImageUrls(urls);
      console.error("API Error:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after the API call completes
    }
  };

  const downloadImage = (imageUrl) => {
    // Create a temporary anchor element to download the image
    fetch(imageUrl, {
      mode: "no-cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob(); // Convert the response to a Blob
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob); // Create a temporary URL for the Blob
        const a = document.createElement("a"); // Create a link element
        a.href = url; // Set the href to the Blob URL
        a.download = "downloaded_image"; // Set the download filename
        document.body.appendChild(a); // Append the link to the document
        a.click(); // Trigger the download
        document.body.removeChild(a); // Clean up the link element
        URL.revokeObjectURL(url); // Revoke the Blob URL to free up memory
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  };

  return (
    <div className="page">
      <h1>Logo Maker</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brandName">Brand Name:</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={brandName}
            onChange={(e) => setbrandName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bestSellerItem">Best Seller Item:</label>
          <input
            type="text"
            id="bestSellerItem"
            name="bestSellerItem"
            value={bestSellerItem}
            onChange={(e) => setbestSellerItem(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Generate Logo
        </button>
      </form>

      {/* Show loading video when isLoading is true */}
      {isLoading && (
        <div className="loading-container">
          <video
            className="loading-video"
            width="500"
            height="500"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="/videos/loading.mp4" // Replace with your actual video URL
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Display images in a grid */}
      <div className="image-grid">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="image-container"
            onClick={() => downloadImage(url)}
          >
            <img
              src={url}
              alt={`Generated logo ${index + 1}`}
              className="image"
            />
            <div className="overlay">
              <span className="download-text">
                Download <i className="download-icon">⬇️</i>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RemoveBackgroundPage = () => (
  <div className="page">
    <h1>Remove Background</h1>
    <form>
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL:</label>
        <input type="url" id="imageUrl" name="imageUrl" required />
      </div>
      <div className="form-group">
        <label htmlFor="imageSize">Image Size:</label>
        <input type="text" id="imageSize" name="imageSize" />
      </div>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  </div>
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default App;
