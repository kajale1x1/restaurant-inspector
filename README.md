NYC Restaurant Health Inspector — Chrome Extension

A lightweight, Vanilla JavaScript Chrome extension that automatically scrapes NYC restaurant addresses from Yelp pages, normalizes address strings using custom regular expressions, and overlays official NYC Department of Health and Mental Hygiene (DOHMH) inspection grades and historical data directly onto the page.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=flat-square&logo=javascript)
![Chrome Extension](https://img.shields.io/badge/Chrome_Manifest-v3-blue?style=flat-square&logo=googlechrome)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- **Automated Meta Scraping**: Extracts restaurant names, street addresses, and ZIP codes dynamically from page meta tags.
- **Regex Address Normalization**: Cleans and standardizes variable street strings (e.g., converting `"38 MacDougal St"` to `"38 MACDOUGAL STREET"`) to ensure 1:1 matching against dataset keys.
- **Sorting & Disambiguation**: Uses a custom array sorting algorithm to handle multiple inspection records and extract the most recent inspection date (`dateB - dateA`).
- **DOM Overlay**: Injects a custom health inspection badge with grade badges (A/B/C) directly into Yelp's user interface.

---

## 📁 Repository Structure

```text
├── manifest.json                  # Chrome Extension Manifest (v3)
├── content.js                     # Content script (address extraction & DOM overlay)
├── findBestMatch.js               # Matching & sorting algorithms
├── background.js                  # Extension service worker
├── restaurant_inspection.json # Sample dataset for testing (1500 records)
├── .gitignore                     # Ignores large local JSON datasets
└── README.md                      # Project documentation

## 📊 Dataset Options

Due to GitHub file size limits, this repository includes a 16MB sample dataset (`restaurant_inspection.json`) for instant development.

* 📥 **[Download Full Dataset (100MB+)](https://drive.google.com/file/d/1JOMAulU1YRrK-WXpOP1ALiFB12To75Da/view?usp=sharing)** — Contains the complete NYC DOHMH health inspection records.
* 📄 **[Download Sample Dataset](https://raw.githubusercontent.com/kajale1x1/restaurant-inspector/main/restaurant_inspection.json)** — 16MB subset included in this repository.