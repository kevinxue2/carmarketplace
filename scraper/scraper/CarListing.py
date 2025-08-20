from dataclasses import dataclass, asdict
import json

# @dataclass
class CarListing:
    title: str = None
    year: int = None
    brand: str = None
    model: str = None
    trim: str = None
    price: float = None
    transmission: str = None
    kilometers: int = None
    color: str = None
    fuel_type: str = None
    link: str = None
    location: str = None
    photos: list = []

    def __init__(self):
        self.title: str = None
        self.year: int = None
        self.brand: str = None
        self.model: str = None
        self.trim: str = None
        self.price: float = None
        self.transmission: str = None
        self.kilometers: int = None
        self.color: str = None
        self.fuel_type: str = None
        self.link: str = None
        self.location: str = None
        self.photos: list = []
    
    def to_dict(self):
        """Convert the class instance to a dictionary."""
        return self.__dict__

    def to_json(self, indent=4):
        """Convert the class instance to a JSON string."""
        return json.dumps(self.to_dict(), indent=indent)
