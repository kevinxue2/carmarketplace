from selenium import webdriver
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import json
import re
import os
from .CarListing import CarListing
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CONFIG_PATH = os.path.join(f'{PROJECT_ROOT}/scraper/', "config.json")

base_url = 'https://www.autotrader.ca/'
with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

def create_url(make, model):
    make = make.lower().replace(' ', '%20').replace('/', '-')
    model = model.lower().replace(' ', '%20').replace('/', '-')
    url = f'{base_url}/cars/{make}/{model}'
    return url

def clean_link(url):
    idx = url.rfind('?')
    if idx == -1:
        return url
    return url[:idx]

def get_makes(driver):
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    carMakes = set()
    select_tag = soup.find("select", id="rfMakes")
    for optgroup in select_tag.find_all("optgroup"):
        for option in optgroup.find_all("option"):
            text = option.text
            carMakes.add(text)
    return sorted(list(carMakes))

def get_model(driver, make):
    select_make = driver.find_element(By.ID, "rfMakes")
    Select(select_make).select_by_visible_text("Any Make")
    WebDriverWait(driver, 15).until(
        lambda d: not d.find_element(By.ID, "rfModel").is_enabled()
    )
    Select(select_make).select_by_value(make)
    WebDriverWait(driver, 15).until(
        lambda d: d.find_element(By.ID, "rfModel").is_enabled()
    )
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    select_tag = soup.find("select", id="rfModel")
    carModels = []
    for option in select_tag.find_all("option"):
        text = option.text
        carModels.append(text)
    return carModels[1:]

def get_listing(driver, make, model):
    url = create_url(make, model)
    options = ""
    if (config['transmission'] == 'manual'):
        options += '&trans=Manual'
    if (config['seller_type'] == 'private'):
        options += '&adType=Private'
    driver.get(f'{url}/?{options}')
    count_element = driver.find_element(By.ID, "titleCount")
    rcp = 15
    pages = (int(count_element.text) + 14) // 15
    
    links = set()
    print(f"scraping {len(links)} links")
    for i in range(pages):
        driver.get(f'{url}/?rcp={rcp}&rcs={i*rcp}{options}')
        results = driver.find_elements(By.CLASS_NAME, "result-item")
        for x in results:
            links.add(x.find_elements(By.CLASS_NAME, "inner-link")[0].get_attribute("href"))

    listings = []
    for x in links:
        listings.append(create_listing(driver, x, make, model))
        print(f"appending vehicle {len(listings)}/{len(links)}")
    return listings
    
    
    
def create_listing(driver, listing, make, model):
    car = CarListing()
    car.link = clean_link(listing)
    car.make = make
    car.model = model
    driver.get(car.link)

    # get from title
    title = driver.find_element(By.CSS_SELECTOR, ".hero-title").get_attribute("innerHTML")
    car.title = title
    car.year = int(title[:4])
    price = driver.find_element(By.CSS_SELECTOR, ".hero-price").get_attribute("innerHTML")
    car.price =  int(re.sub(r"\D", "", price))
    location = driver.find_element(By.CSS_SELECTOR, ".hero-location").get_attribute("innerHTML")
    car.location = location.split('|')[1].strip()
    # get all specs list
    ul_element = driver.find_element(By.ID, "sl-card-body")
    spec_items = ul_element.find_elements(By.TAG_NAME, "li")
    specs_dict = {}
    for item in spec_items:
        key = item.find_element(By.CSS_SELECTOR, "[id^='spec-key']").get_attribute("textContent").strip()
        value = item.find_element(By.CSS_SELECTOR, "[id^='spec-value']").get_attribute("textContent").strip()
        specs_dict[key] = value
    car.trim = specs_dict.get('Trim')
    car.transmission = specs_dict.get('Transmission')
    car.kilometers = int(re.sub(r"\D", "", specs_dict.get('Kilometres')))
    car.color = specs_dict.get('Exterior Colour')
    car.fuel_type = specs_dict.get('Fuel Type')
    
    # set image
    main_img = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.CSS_SELECTOR, "#mainPhoto, #mainPhotoXS")
    )
    car.photos.append(main_img.get_attribute("src"))
    time.sleep(config["delay"])
    return car