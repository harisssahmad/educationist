from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import os
import json
import time
import re

BASE = "https://pastpapers.papacambridge.com/"
START = BASE

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', '_', name)

def setup_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(options=options)
    return driver

def get_boards(driver):
    driver.get(START)
    time.sleep(2)

    board_links = driver.find_elements(By.CSS_SELECTOR, "div.kt-widget4__item a")
    boards = []
    for link in board_links:
        name = sanitize_filename(link.text)
        url = link.get_attribute("href")
        boards.append({"name": name, "url": url})
        print(f"✅ Found board: {name}")
    return boards

def crawl_subject(driver, url):
    print(f"    🌐 Visiting subject URL: {url}")
    driver.get(url)
    time.sleep(1)

    pdf_links = driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")
    result = []
    for link in pdf_links:
        href = link.get_attribute("href")
        text = link.text or os.path.basename(href)
        result.append({
            "link": href,
            "text": text,
            "textCondensed": os.path.basename(href).replace(".pdf", "")
        })
    print(f"    📄 Found {len(result)} PDF(s)")
    return result

def main():
    driver = setup_driver()
    boards = get_boards(driver)

    for board in boards:
        print(f"\n📁 Processing board: {board['name']}")
        driver.get(board['url'])
        time.sleep(1)

        subject_links = driver.find_elements(By.CSS_SELECTOR, "div.item-folder-type a")
        print(f"🔹 Found {len(subject_links)} subject(s)")

        board_path = os.path.join(os.getcwd(), board['name'])
        os.makedirs(board_path, exist_ok=True)

        for subj in subject_links:
            subj_name = sanitize_filename(subj.text)
            subj_url = subj.get_attribute("href")
            print(f"\n  ➤ Crawling subject: {subj_name}")
            data = crawl_subject(driver, subj_url)

            file_path = os.path.join(board_path, f"{subj_name}.json")
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"    💾 Saved to {file_path}")

    driver.quit()

if __name__ == "__main__":
    main()
