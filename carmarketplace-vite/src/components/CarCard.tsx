// src/components/CarCard.tsx
import { useState } from "react";
import type { Car } from "../models/Car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    
    // TODO
  };

  return (
    <div className="border rounded-md overflow-hidden shadow-md hover:shadow-lg transition">
      <a href={car.link} target="_blank" rel="noopener noreferrer">
        <div className="w-full aspect-square overflow-hidden relative">
          <img
            src={
              car.photos?.[0] ||
              "https://www.autotrader.ca/Images/Pages/VdpFuji/ghost-image-lg.svg"
            }
            alt={car.title}
            className="w-full h-full object-cover"
          />
          
          {/* Source Badge - Top Center */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {"AutoTrader"}
            </span>
          </div>
          
          {/* Favorite Heart - Top Right */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all group"
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg 
              className={`w-5 h-5 transition-all ${
                isFavorited 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-white group-hover:text-red-300 group-hover:scale-105'
              }`}
              fill={isFavorited ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>
      </a>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{car.title}</h2>
        <p className="text-gray-300 font-medium">${car.price.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{car.kilometers.toLocaleString()} km • {car.transmission}</p>
      </div>
    </div>
  );
}