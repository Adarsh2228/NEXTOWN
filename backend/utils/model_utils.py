# backend/utils/model_utils.py
import os
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

MODEL_DIR = os.path.dirname(__file__)
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

def load_pickle(name):
    path = os.path.join(MODEL_DIR, name)
    with open(path, 'rb') as f:
        return pickle.load(f)

def initialize_models():
    data = load_pickle("business_vectors.pkl")
    labels = load_pickle("business_labels.pkl")
    return data, labels

def analyze_business_type(business_name, data, labels):
    input_vec = sentence_model.encode([business_name])
    similarities = cosine_similarity(input_vec, data)[0]
    top_idx = np.argmax(similarities)
    return {
        "input": business_name,
        "top_category": labels[top_idx],
        "confidence": float(similarities[top_idx])
    }
