import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Category and type constants
const categories = [
  "CAMERAS",
  "LENS",
  "DRONE",
  // make a collection
  "PHOTOGRAPHY EQUIPMENTS",
  "VIDEOGRAPHY EQUIPMENTS",
  "AUDIO EQUIPMENTS",
  "CINE EQUIPMENTS",
  "VISUAL EQUIPMENT",
  "MANPOWER"
];

const equipmentTypes = [
  
  
  { name: "DSLR Cameras", img: "https://png.pngtree.com/png-clipart/20220827/ourmid/pngtree-camera-dslr-ilustration-png-image_6125620.png", type: "dslr" },
  { name: "Mirrorless Cameras", img: "https://m.media-amazon.com/images/I/41yE12YddjL._SY300_SX300_QL70_FMwebp_.jpg", type: "mirrorless" },
  { name: "Lens", img: "https://cdn.media.amplience.net/i/canon/27_canon-ef-600mm-f-4l-is-ii-usm_b8444ec598a44604b61d25b438fae05e", type: "lens" },
  { name: "GoPro Cameras", img: "https://m.media-amazon.com/images/I/31Q8himJ7dL._SX300_SY300_QL70_FMwebp_.jpg", type: "gopro" },
  { name: "Wildlife Photography", img: "https://m.media-amazon.com/images/I/31a2ZRDvYxL._SX300_SY300_QL70_FMwebp_.jpg", type: "wildlife" },
  { name: "Insta360 Cameras", img: "https://m.media-amazon.com/images/I/41GBIJSUWyL._SX300_SY300_QL70_FMwebp_.jpg", type: "insta360" }, { name: "support", img: "https://m.media-amazon.com/images/I/61WcJNi4NPL._UF1000,1000_QL80_.jpg", type: "support" },
  { name: "mic", img: "https://static.vecteezy.com/system/resources/thumbnails/041/450/719/small_2x/ai-generated-black-studio-broadcast-microphone-png.png", type: "mic" },
  { name: "light", img: "https://media-assets.hyperinvento.com/companies/fa691107-50d8-4f5e-a22d-387262bb0289/products/d2f72b02-ce15-4bc6-83b9-6b39a51d8d44/assetss/files/c353b7a7b5914a92a9a3c065d577160e-product-assets.jpg", type: "light" },
  { name: "DJI Drones", img: "https://m.media-amazon.com/images/I/31niq9WpYXL._SX300_SY300_QL70_FMwebp_.jpg", type: "drone" }
 
];

const brandsByType = {
  dslr: ["Sony", "Canon", "Nikon"],
  mirrorless: ["Sony", "Canon", "Nikon", "Panasonic", "Fujifilm"],
  lens:["Sony", "Canon", "Nikon", "Panasonic", "Fujifilm"],
  gopro: ["GoPro 13", "GoPro 12", "GoPro 11", "GoPro 10", "GoPro Fusion"],
  insta360: ["Insta360 X3", "Insta360 X2", "Insta360 One RS", "Insta360 One R"],
  wildlife: ["Sony", "Canon", "Nikon"],
  drone: ["DJI Nano", "DJI Phantom", "FPV Drone"],
  support: ["DJI Gimbal", "Tripod", "Monopod", "Stand", "Slider"],
  mic: ["Hollyland", "Digitek", "Rode"],
  light: ["Godox","Digitek", "Aputure"] // added common light brands
};


const buttonBase =
  "px-5 py-2 rounded-full border font-medium shadow transition";

const Collection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const placeholderImage = "/images/placeholder.png";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtered products memoized for performance
  const filteredProducts = useMemo(() => {
    if (selectedCategory) {
      return products.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (selectedType && selectedBrand) {
      return products.filter(
        (p) =>
          p.type?.toLowerCase() === selectedType.toLowerCase() &&
          p.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    if (selectedType) {
      return products.filter(
        (p) => p.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }
    return [];
  }, [products, selectedCategory, selectedType, selectedBrand]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-[#1A97A9] to-[#153c43] text-white shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
          Our <span className="text-[#1A97A9]">Collections</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-6">
          Browse our carefully curated collections of professional camera gear
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 py-8">
        {/* Browse by Type */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Browse by Type
          </h2>
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-6 mb-12">
          
          {equipmentTypes.map((type) => (
            <div
              key={type.name}
              className={`flex flex-col items-center bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition border border-gray-100 hover:border-[#1A97A9] ${
                selectedType === type.type ? "ring-2 ring-[#1A97A9]" : ""
              }`}
              onClick={() => {
                setSelectedType(type.type);
                setSelectedBrand(null);
                setSelectedCategory(null);
              }}
            >
              <img
                src={type.img}
                alt={type.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="font-semibold text-gray-700 text-center">
                {type.name}
              </span>
            </div>
          ))}
        </section>

        {/* Dynamic Brands for selected type */}
        {selectedType && brandsByType[selectedType] && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {brandsByType[selectedType].map((brand) => (
              <button
                key={brand}
                className={`${buttonBase} ${
                  selectedBrand === brand
                    ? "bg-[#E0F7FA] text-[#167a8a] border-[#167a8a]"
                    : "bg-white text-[#1A97A9] border-[#1A97A9] hover:bg-[#E0F7FA]"
                }`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="text-sm text-[#1A97A9] ml-4 underline"
              >
                Clear Brand
              </button>
            )}
          </div>
        )}

        {/* Browse by Classification */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Browse by Classification
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${buttonBase} ${
                selectedCategory === cat
                  ? "bg-[#E0F7FA] text-[#167a8a] border-[#167a8a]"
                  : "bg-white text-[#1A97A9] border-[#1A97A9] hover:bg-[#E0F7FA]"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {selectedCategory && (
          <div className="text-center mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-[#1A97A9] hover:underline"
            >
              Clear Filter
            </button>
          </div>
        )}
        {selectedType && (
          <div className="text-center mb-6">
            <button
              onClick={() => {
                setSelectedType(null);
                setSelectedBrand(null);
              }}
              className="text-sm text-[#1A97A9] hover:underline"
            >
              Clear Equipment Type
            </button>
          </div>
        )}

        {/* Filtered Products */}
        {(selectedCategory || selectedType) && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Showing products for:{" "}
              <span className="text-[#1A97A9]">
                {selectedCategory
                  ? selectedCategory
                  : equipmentTypes.find((t) => t.type === selectedType)?.name}
                {selectedBrand ? ` - ${selectedBrand}` : ""}
              </span>
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 hover:shadow-lg transition"
                  >
                    <img
                      src={product.imageUrl || placeholderImage}
                      alt={product.name}
                      className="w-20 h-20 object-contain mb-3"
                    />
                    <div className="font-bold text-lg text-gray-800 mb-1">
                      {product.name}
                    </div>
                    <div className="text-[#1A97A9] font-semibold mb-1">
                      ₹{product.price}
                    </div>
                    <div className="text-gray-600 text-sm mb-2 text-center">
                      {product.desc || "No description"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No products found for this selection.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Collection;
