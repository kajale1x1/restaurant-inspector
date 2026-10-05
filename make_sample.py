import json

INPUT_FILE = "restaurant_inspection_full.json"
OUTPUT_FILE = "restaurant_inspection.json"
SAMPLE_COUNT = 15000  # ~15,000 records yields roughly 10-15 MB

print("Loading dataset...")
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# Take a slice of the dataset
sample_data = data[:SAMPLE_COUNT]

print(f"Saving {len(sample_data)} records to {OUTPUT_FILE}...")
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(sample_data, f, indent=2)

print("Done! Sample dataset created successfully.")
