from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import json
import os
import time

# Setup headless Chrome
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")
driver = webdriver.Chrome(options=options)

# === CONFIG ===
subject_url = "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level-accounting-9706"
board_name = "CAIE"
subject_name = "Accounting-9706"

# === GO TO SUBJECT PAGE ===
print(f"Opening subject page: {subject_url}")
driver.get(subject_url)
time.sleep(2)


# Find all folders (e.g. 2024-Oct-Nov)
folder_items = driver.find_elements(By.CSS_SELECTOR, 'div.item-folder-type a.kt-nav__link-text')
print(f"Found {len(folder_items)} folders.")

papers = []
folder_data = [(f.text.strip(), f.get_attribute("href")) for f in folder_items]

for idx, (folder_text, folder_href) in enumerate(folder_data):
    if not folder_href:
        print(f"  Skipping folder with no href: {folder_text}")
        continue

    print(f"\n[{idx+1}/{len(folder_data)}] Opening folder: {folder_text}")
    driver.get(folder_href)
    time.sleep(2)

    # Find all papers in the folder
    paper_divs = driver.find_elements(By.CSS_SELECTOR, 'div.item-pdf-type')
    print(f"  ↳ Found {len(paper_divs)} papers in {folder_text}")

    for paper_div in paper_divs:
        try:
            name_span = paper_div.find_element(By.CSS_SELECTOR, 'a.kt-nav__link-text span.wraptext')
            download_button = paper_div.find_element(By.CSS_SELECTOR, 'a.badge-info')

            text = name_span.text.strip()
            download_url = download_button.get_attribute("href")
            text_condensed = download_url.split("/")[-1].replace(".pdf", "")

            papers.append({
                "link": download_url,
                "text": text,
                "textCondensed": text_condensed
            })

        except Exception as e:
            print(f"    [!] Skipping paper (error): {e}")


# === SAVE TO JSON ===
output_dir = os.path.join(os.getcwd(), board_name)
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, f"{subject_name}.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump({"papers": papers}, f, indent=2)

print(f"\n✅ Done! Saved {len(papers)} papers to {output_path}")
driver.quit()
