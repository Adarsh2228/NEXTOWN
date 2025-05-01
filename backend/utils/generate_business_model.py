# backend/utils/generate_business_model.py
import os
import pickle
from sentence_transformers import SentenceTransformer

business_categories = [
    "Gym", "Café", "Bakery", "Pharmacy", "Restaurant", "Bookstore", "Salon",
    "Supermarket", "Electronics Store", "Clothing Store", "Pet Store",
    "Hotel", "Auto Repair", "Jewelry Store", "Bar", "Toy Store", "Spa"
]

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(business_categories)

MODEL_DIR = os.path.dirname(__file__)
os.makedirs(MODEL_DIR, exist_ok=True)

with open(os.path.join(MODEL_DIR, 'business_vectors.pkl'), 'wb') as f:
    pickle.dump(embeddings, f)

with open(os.path.join(MODEL_DIR, 'business_labels.pkl'), 'wb') as f:
    pickle.dump(business_categories, f)

print("✅ Business vector model saved successfully.")
