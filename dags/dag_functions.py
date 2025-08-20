import os
import json
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"

load_dotenv(dotenv_path=env_path)

DATA_DIR = os.path.expanduser("~/carscraper/data")

def get_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("host"),
            port=os.getenv("port"),
            dbname=os.getenv("dbname"),
            user=os.getenv("user"),
            password=os.getenv("password")
        )
        return conn
    except Exception as e:
        print(e)
        return None

def load_db():
    db = get_connection()
    cursor = db.cursor()

    for filename in os.listdir(DATA_DIR):
        if filename.endswith(".json"):
            file_path = os.path.join(DATA_DIR, filename)
            with open(file_path, "r") as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError as e:
                    print(f"Error reading {filename}: {e}")
                    continue
                if (filename == "makemodel.json"):
                    continue
                for item in data:
                    cursor.execute(
                        """
                        INSERT INTO public.cars (
                            title, brand, model, trim, price,
                            transmission, kilometers, color, fuel_type,
                            link, location, photos, year
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            item.get("title"),
                            item.get("make"),
                            item.get("model"),
                            item.get("trim"),
                            item.get("price"),
                            item.get("transmission", "Automatic"),
                            item.get("kilometers"),
                            item.get("color"),
                            item.get("fuel_type", "Gasoline"),
                            item.get("link"),
                            item.get("location"),
                            item.get("photos"),
                            item.get("year", 1900)
                        )
                    )
            db.commit()
            print(f"Successfully inserted {file_path}")

    cursor.close()
    db.close()
        
    

def clean_up():
    for filename in os.listdir(DATA_DIR):
        if filename.endswith("_processed.json"):  # adjust suffix if needed
            filepath = os.path.join(DATA_DIR, filename)
            os.remove(filepath)
            print(f"Removed {filepath}")


if __name__ == "__main__":
    load_db()