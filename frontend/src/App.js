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
        <Header />
        <Routes>
          {/* Set up Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/social-posters" element={<SocialPoster />} />
          <Route path="/logo-maker" element={<LogoMakerPage />} />
          <Route path="/ad-banner" element={<AdBannerPage />} />
          <Route path="/background-remover" element={<BackgroundRemoverPage />} />
        </Routes>
      </div>
    </Router>
  );
};

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div
        className="logo"
        onClick={() => navigate("/")} // Navigate to the homepage on click
        style={{ cursor: "pointer" }} // Add pointer cursor for better UX
      >
        GoPix
      </div>
    </header>
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
        title="AI Logo Maker"
        navigateTo="/logo-maker"
      />
      <Card
        imgSrc="https://mir-s3-cdn-cf.behance.net/projects/404/99fcc8210697073.6716372a5972d.jpg"
        title="AI Social Posters"
        navigateTo="/social-posters"
      />
      <Card
        imgSrc="https://i.postimg.cc/MpVb92VP/Screenshot-2024-11-22-at-2-21-56-AM.png"
        title="Ad Banner"
        navigateTo="/ad-banner"
      />
      <Card
        imgSrc="https://a.storyblok.com/f/160496/1472x981/9bf40ad4ff/bg-removal-slider-v2artboard-1-copy.png"
        title="Background Remover"
        navigateTo="/background-remover"
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

    // await sleep(20000); // Simulate a 3 second delay

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
      {isLoading && <LoadingComponent />}
      <DisplayImageGrid imageUrls={imageUrls} />
    </div>
  );
};

const SocialPoster = () => {
  const [brandName, setbrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [offer, setOffer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // To manage loading state
  const [imageUrls, setImageUrls] = useState([]); // State to store image URLs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    // await sleep(20000); // Simulate a 3 second delay

    const requestBody = {
      brand_name: brandName,
      tagline: tagline,
      offer: offer,
    };

    // Simulate an API call (replace with your actual API call)
    try {
      const response = await fetch("http://localhost:5001/api/poster", {
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

  return (
    <div className="page">
      <h1>Social Poster</h1>
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
          <label htmlFor="tagline">Tagline:</label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="offer">Offer:</label>
          <input
            type="text"
            id="offer"
            name="offer"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Generate Poster
        </button>
      </form>

      {/* Show loading video when isLoading is true */}
      {isLoading && <LoadingComponent />}
      <DisplayImageGrid imageUrls={imageUrls} />
    </div>
  );
};

// Add new AdBannerPage
const AdBannerPage = () => {
  const [brandName, setBrandName] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerUrls, setBannerUrls] = useState([]); // For generated banners

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("brand_name", brandName);
    formData.append("discount", discount);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5001/api/ad-banner", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.urls) {
        setBannerUrls(result.urls);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Ad Banner Maker</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brandName">Brand Name:</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount Percentage:</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Generate Banner
        </button>
      </form>

      {isLoading && <LoadingComponent />}
      <DisplayImageGrid imageUrls={bannerUrls} />
    </div>
  );
};

const BackgroundRemoverPage = () => {
  const [image, setImage] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5001/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.url) {
        setResultUrl(result.url);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Background Remover</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Remove Background
        </button>
      </form>

      {isLoading && <LoadingComponent />}
      {resultUrl && (
        <div className="result-container">
          <h2>Background Removed Image:</h2>
          <img src={resultUrl} alt="Background Removed" className="result-image" />
        </div>
      )}
    </div>
  );
};

const LoadingComponent = () => (
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
);

const DisplayImageGrid = ({ imageUrls }) => (
  <div className="image-grid">
    {imageUrls.map((url, index) => (
      <div key={index} className="image-container">
        <img src={url} alt={`Generated logo ${index + 1}`} className="image" />
      </div>
    ))}
  </div>
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default App;
