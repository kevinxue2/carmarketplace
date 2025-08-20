import json
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from .helpers import get_makes, get_model

DATA_DIR = os.path.expanduser("~/carscraper/data")

def scrape_makemodel():
    chrome_binary = '/Users/kevinxue/Desktop/chrome-mac-arm64/Google Chrome for Testing.app'
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = chrome_binary
    driver = webdriver.Chrome(
        options=chrome_options
    )
    driver.get('https://www.autotrader.ca/')

    # get all vehicle makes
    makes = get_makes(driver)

    make_model = {}
    for x in makes:
        make_model[x] = get_model(driver, x)

    with open(f"{DATA_DIR}/makemodel.json", "w", encoding="utf-8") as f:
        json.dump(make_model, f, indent=4, ensure_ascii=False)

    driver.quit()