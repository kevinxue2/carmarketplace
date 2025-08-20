import json
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from .helpers import get_listing

DATA_DIR = os.path.expanduser("~/carscraper/data")

def scrape_listing(make, model):
    file_path = os.path.join(DATA_DIR, f"{make}_{model}.json")
    
    if os.path.exists(file_path):
        print(f"Skipping {make} {model} (already scraped).")
        return
    
    chrome_binary = '/Users/kevinxue/Desktop/chrome-mac-arm64/Google Chrome for Testing.app'
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = chrome_binary
    driver = webdriver.Chrome(
        options=chrome_options
    )
    
    try:
        listings = get_listing(driver, make, model)
        listings_json = [listing.to_dict() for listing in listings]
        with open(file_path, "w") as f:
            json.dump(listings_json, f, indent=4)
        print(listings_json)
        print(f"Scraped {make} {model} successfully.")
    
    except Exception as e:
        print(f"Error scraping {make} {model}: {e}")
        driver.quit()
        raise ValueError("Scraper returned no data. JSON file not written.")


    driver.quit()

if __name__ == "__main__":
    scrape_listing("Acura", "CSX")

