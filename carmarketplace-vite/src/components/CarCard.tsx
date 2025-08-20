// src/components/CarCard.tsx
import type { Car } from "../models/Car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="border rounded-md overflow-hidden shadow-md hover:shadow-lg transition">
      <a href={car.link} target="_blank" rel="noopener noreferrer">
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={
              car.photos?.[0] ||
              "https://www.autotrader.ca/Images/Pages/VdpFuji/ghost-image-lg.svg"
            }
            alt={car.title}
            className="w-full h-full object-cover"
          />
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
