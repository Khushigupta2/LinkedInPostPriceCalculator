import React, { useState } from "react";
import "./index.css";

const PricingCalculator = () => {
  const [inputs, setInputs] = useState({
    followerCount: 1000,
    engagementRate: 5,
    industry: "Tech",
    contentType: "Text",
    audienceType: "B2B",
    geography: "USA",
    influencerAuthority: "Industry Expert",
    brandAffinity: 3,
  });
  const [price, setPrice] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculatePrice = async () => {
    try {
      const response = await fetch("http://localhost:5000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      setPrice(data.price);
    } catch (error) {
      console.error("Error calculating price:", error);
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        <h1 className="title">LinkedIn Post Pricing Calculator</h1>
        <p className="subtitle">Estimate your charge per post with professional insights.</p>

        <div className="input-group">
          <label><i className="fas fa-users"></i> Follower Count</label>
          <input
            type="range"
            name="followerCount"
            min="100"
            max="100000"
            step="100"
            value={inputs.followerCount}
            onChange={handleChange}
          />
          <span>{inputs.followerCount}</span>
        </div>

        <div className="input-group">
          <label><i className="fas fa-chart-line"></i> Engagement Rate (%)</label>
          <input
            type="range"
            name="engagementRate"
            min="0.1"
            max="20"
            step="0.1"
            value={inputs.engagementRate}
            onChange={handleChange}
          />
          <span>{inputs.engagementRate}%</span>
        </div>

        <div className="dropdown-group">
          <div>
            <label><i className="fas fa-industry"></i> Industry</label>
            <select name="industry" value={inputs.industry} onChange={handleChange}>
              <option value="Tech">Tech</option>
              <option value="Finance">Finance</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div>
            <label><i className="fas fa-file-alt"></i> Content Type</label>
            <div className="button-group">
              {["Text", "Image", "Video", "Carousel"].map((type) => (
                <button
                  key={type}
                  onClick={() => setInputs({ ...inputs, contentType: type })}
                  className={inputs.contentType === type ? "active" : ""}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label><i className="fas fa-briefcase"></i> Audience Type</label>
            <select name="audienceType" value={inputs.audienceType} onChange={handleChange}>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
            </select>
          </div>

          <div>
            <label><i className="fas fa-globe"></i> Geography</label>
            <select name="geography" value={inputs.geography} onChange={handleChange}>
              <option value="USA">USA</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label><i className="fas fa-user-tie"></i> Influencer Authority</label>
          <select name="influencerAuthority" value={inputs.influencerAuthority} onChange={handleChange}>
            <option value="CEO">CEO</option>
            <option value="Industry Expert">Industry Expert</option>
            <option value="Enthusiast">Enthusiast</option>
          </select>
        </div>

        <div className="input-group">
          <label><i className="fas fa-star"></i> Brand Affinity</label>
          <input type="range" name="brandAffinity" min="1" max="5" step="1" value={inputs.brandAffinity} onChange={handleChange} />
          <span>{inputs.brandAffinity}</span>
        </div>

        <button onClick={calculatePrice} className="calculate-btn">Calculate Price</button>

        {price !== null && (
          <div className="result">
            <h2>Predicting Price is: <span>${price ? price.toFixed(2) : "N/A"}</span></h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;