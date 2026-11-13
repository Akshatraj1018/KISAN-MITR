// src/pages/FarmDetails.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Share2,
} from "lucide-react";
import "../styles/FarmDetails.css";
import BottomNav from "../components/BottomNav";

export default function FarmDetails() {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddedToast, setIsAddedToast] = useState(false);

  // High-resolution crop / nursery photographs matching Image 2 Screen 2
  const productImages = [
    {
      id: 0,
      url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=700&auto=format&fit=crop&q=80",
      caption: "Certified Seedling Stage (Front View)",
    },
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=700&auto=format&fit=crop&q=80",
      caption: "Lush Leaf Foliage & Disease Resistance",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700&auto=format&fit=crop&q=80",
      caption: "Healthy Root Ball & Potting Medium",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=700&auto=format&fit=crop&q=80",
      caption: "Nursery Germination Tray",
    },
  ];

  const relatedProducts = [
    {
      id: 1,
      name: "Bell Pepper Plugs",
      price: "₹180/tray",
      img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Bio-NPK Humic Fertilizer",
      price: "₹450/bag",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Organic Neem Bio-Spray",
      price: "₹320/bot",
      img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Precision Drip Emitters",
      price: "₹850/kit",
      img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&auto=format&fit=crop&q=80",
    },
  ];

  const handleAddToCart = () => {
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 2800);
  };

  return (
    <div className="km-details-page">
      <main className="km-details-container">
        {/* Top App Bar */}
        <header className="km-details-nav-bar">
          <button
            className="km-details-nav-btn"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="km-details-nav-title">Farm Details</h1>
          <button
            className="km-details-nav-btn"
            onClick={() => navigate("/call")}
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </header>

        {/* 3D Circular Pedestal & Product Showcase Stage */}
        <section className="km-details-stage">
          <div className="km-stage-circle-podium">
            <div className="km-podium-ring"></div>
            <img
              src={productImages[selectedImageIndex].url}
              alt="Farm Specimen"
              className="km-stage-plant-img"
              loading="lazy"
            />
          </div>

          {/* Interactive Thumbnails Selector */}
          <div className="km-thumbnails-strip">
            {productImages.map((img, idx) => (
              <button
                key={img.id}
                className={`km-thumbnail-box ${selectedImageIndex === idx ? "active" : ""}`}
                onClick={() => setSelectedImageIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
              >
                <img src={img.url} alt={img.caption} />
                {selectedImageIndex === idx && <div className="km-thumb-active-dot" />}
              </button>
            ))}
          </div>
        </section>

        {/* Bottom Rounded Card / Sheet */}
        <section className="km-details-sheet">
          <div className="km-sheet-header-row">
            <div>
              <h2 className="km-sheet-title">Lime Seedlings</h2>
              <div className="km-stock-badge">
                <CheckCircle2 size={12} className="km-stock-icon" />
                <span>Available in stock</span>
              </div>
            </div>

            <div className="km-sheet-pricing">
              <div className="km-sheet-price">₹250 <span className="km-sheet-unit">/tray</span></div>
              <div className="km-rating-pill">
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span className="km-rating-num">4.9</span>
                <span className="km-rating-count">(192)</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector Counter */}
          <div className="km-quantity-bar">
            <span className="km-qty-label">Order Quantity</span>
            <div className="km-counter-pill">
              <button
                className="km-counter-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="km-counter-val">{quantity} tray</span>
              <button
                className="km-counter-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="km-desc-block">
            <h3 className="km-section-heading">Description</h3>
            <p className="km-desc-text">
              Certified disease-free hybrid lime seedlings cultivated under controlled climate protocols at the Sundargarh Agricultural Research Station. Hardened for superior drought tolerance, strong taproot anchorage, and fast fruiting cycles within 18 months.{" "}
              {isExpanded ? (
                <span>
                  Treated with biological mycorrhizae to boost phosphorus uptake by up to 40%. Suitable for alluvial, black, and red loamy soils with pH between 6.0 and 7.8.
                </span>
              ) : (
                <button className="km-read-more-link" onClick={() => setIsExpanded(true)}>
                  Read More
                </button>
              )}
            </p>
          </div>

          {/* Related Products Grid */}
          <div className="km-related-block">
            <h3 className="km-section-heading">Related Products</h3>
            <div className="km-related-grid">
              {relatedProducts.map((prod) => (
                <div key={prod.id} className="km-related-card">
                  <div className="km-related-img-wrap">
                    <img src={prod.img} alt={prod.name} loading="lazy" />
                  </div>
                  <div className="km-related-info">
                    <span className="km-related-name">{prod.name}</span>
                    <span className="km-related-price">{prod.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Bottom Add To Cart CTA Button */}
          <div className="km-bottom-action-area">
            <button
              className="km-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>+ Add To Cart</span>
            </button>
          </div>
        </section>

        {/* Feedback Toast */}
        {isAddedToast && (
          <div className="km-toast-message">
            <CheckCircle2 size={16} />
            <span>Added {quantity} tray(s) to your Krishi Cart!</span>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
