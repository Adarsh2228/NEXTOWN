
# from dotenv import load_dotenv
# load_dotenv()

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from utils.analytics_main import initialize_models, analyze_business_type, ask_question, precompute_dataset_embeddings
# import pandas as pd
# import base64

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Load dataset and initialize models once
# try:
#     df = pd.read_csv('./utils/indian_business_performance_data.csv')
#     print("Dataset loaded successfully.")
# except Exception as e:
#     print(f"Error loading dataset: {e}")
#     raise

# try:
#     text_generator, sentence_model = initialize_models()
#     print("Models initialized successfully.")
# except Exception as e:
#     print(f"Error initializing models: {e}")
#     raise

# try:
#     precompute_dataset_embeddings(df)
#     print("Embeddings precomputed successfully.")
# except Exception as e:
#     print(f"Error precomputing embeddings: {e}")
#     raise

# @app.route("/api/analyze", methods=["POST"])
# def analyze():
#     data = request.get_json()
#     business_type = data.get('businessType')
    
#     if not business_type:
#         return jsonify({"error": "Business type is required"}), 400

#     try:
#         results, figures = analyze_business_type(df, business_type)

#         # Convert figures to base64 PNGs for frontend display
#         base64_figures = {}
#         if figures:
#             for key, fig in figures.items():
#                 img_bytes = fig.to_image(format="png")
#                 base64_str = base64.b64encode(img_bytes).decode("utf-8")
#                 base64_figures[key] = f"data:image/png;base64,{base64_str}"

#         return jsonify({**results, "figures": base64_figures})
#     except Exception as e:
#         print(f"Error during analysis: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/api/ask', methods=['POST'])
# def ask():
#     data = request.get_json()
#     question = data.get('question')
#     insights = data.get('graph_insights', {})

#     if not question:
#         return jsonify({"error": "Question is required"}), 400

#     try:
#         answer = ask_question(df, question, insights)
#         return jsonify({"answer": answer})
#     except Exception as e:
#         print(f"Error during question answering: {e}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0", port=5000)



# # utils/ask.py

# import numpy as np
# import pandas as pd
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

# sentence_model = SentenceTransformer("paraphrase-MiniLM-L3-v2")
# DATASET_ROWS, DATASET_EMBEDDINGS = None, None


# def precompute_dataset_embeddings(df):
#     global DATASET_ROWS, DATASET_EMBEDDINGS
#     print("⚙️ Preparing dataset for embedding...")

#     DATASET_ROWS = df.astype(str).apply(lambda row: " | ".join(row), axis=1).tolist()
#     batch_size = 1000
#     embeddings = []

#     for i in range(0, len(DATASET_ROWS), batch_size):
#         print(f"🔄 Embedding batch {i} - {min(i+batch_size, len(DATASET_ROWS))}...")
#         batch = DATASET_ROWS[i:i+batch_size]
#         batch_embeddings = sentence_model.encode(batch, convert_to_numpy=True)
#         embeddings.append(batch_embeddings)

#     DATASET_EMBEDDINGS = np.vstack(embeddings)
#     print("✅ Embeddings precomputed.")


# def enhanced_search(question):
#     try:
#         if SERPAPI_API_KEY:
#             response = requests.get("https://serpapi.com/search", params={
#                 "q": question,
#                 "api_key": SERPAPI_API_KEY,
#                 "engine": "google",
#                 "num": 5
#             }, timeout=10)
#             response.raise_for_status()
#             data = response.json()
#             if "organic_results" in data:
#                 results = [
#                     f"- {res.get('title', '')}: {res.get('snippet', '')} (🔗 {res.get('link', '')})"
#                     for res in data["organic_results"][:3]
#                 ]
#                 return "\n".join(results)
#         return "No good Google result found."
#     except Exception as e:
#         return f"❌ Web search failed: {e}"


# def ask_question(df, question, graph_insights):
#     global DATASET_ROWS, DATASET_EMBEDDINGS

#     responses = []

#     # 1. Graph insights
#     if graph_insights:
#         graph_texts = list(graph_insights.values())
#         graph_embeddings = sentence_model.encode(graph_texts, convert_to_numpy=True)
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         similarity = cosine_similarity(q_embedding, graph_embeddings)[0]
#         best_idx = np.argmax(similarity)
#         if similarity[best_idx] > 0.7:
#             responses.append(f"📊 Graph insight: {graph_texts[best_idx]}")

#     # 2. Dataset
#     if DATASET_EMBEDDINGS is not None:
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
#         best_idx = np.argmax(scores)
#         if scores[best_idx] > 0.65:
#             responses.append(f"🔍 From dataset: {DATASET_ROWS[best_idx]}")

#     # 3. Web fallback
#     if not responses:
#         web_answer = enhanced_search(question)
#         responses.append(f"🌐 Web: {web_answer}")

#     # 4. Final summarization (minimum 50 words)
#     context = "\n".join(responses)
#     if len(context.split()) < 50:
#         context += "\n\n(Note: The information provided is based on the most relevant match and may be summarized.)"

#     return context




import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

sentence_model = SentenceTransformer("paraphrase-MiniLM-L3-v2")
DATASET_ROWS, DATASET_EMBEDDINGS = None, None


def precompute_dataset_embeddings(df):
    global DATASET_ROWS, DATASET_EMBEDDINGS
    print("⚙️ Preparing dataset for embedding...")

    DATASET_ROWS = df.astype(str).apply(lambda row: " | ".join(row), axis=1).tolist()
    batch_size = 1000
    embeddings = []

    for i in range(0, len(DATASET_ROWS), batch_size):
        print(f"🔄 Embedding batch {i} - {min(i + batch_size, len(DATASET_ROWS))}...")
        batch = DATASET_ROWS[i:i + batch_size]
        batch_embeddings = sentence_model.encode(batch, convert_to_numpy=True)
        embeddings.append(batch_embeddings)

    DATASET_EMBEDDINGS = np.vstack(embeddings)
    print("✅ Embeddings precomputed.")


def enhanced_search(question):
    try:
        if SERPAPI_API_KEY:
            response = requests.get("https://serpapi.com/search", params={
                "q": question,
                "api_key": SERPAPI_API_KEY,
                "engine": "google",
                "num": 5
            }, timeout=10)
            response.raise_for_status()
            data = response.json()
            if "organic_results" in data:
                results = [
                    f"- {res.get('title', '')}: {res.get('snippet', '')} (🔗 {res.get('link', '')})"
                    for res in data["organic_results"][:3]
                ]
                return "\n".join(results)
        return "No good Google result found."
    except Exception as e:
        return f"❌ Web search failed: {e}"


def ask_question(df, question, graph_insights):
    global DATASET_ROWS, DATASET_EMBEDDINGS

    responses = []

    # 1. Graph insights
    if graph_insights:
        graph_texts = list(graph_insights.values())
        graph_embeddings = sentence_model.encode(graph_texts, convert_to_numpy=True)
        q_embedding = sentence_model.encode([question], convert_to_numpy=True)
        similarity = cosine_similarity(q_embedding, graph_embeddings)[0]
        best_idx = np.argmax(similarity)
        if similarity[best_idx] > 0.7:
            responses.append(f"📊 Graph insight: {graph_texts[best_idx]}")

    # 2. Dataset
    if DATASET_EMBEDDINGS is not None:
        q_embedding = sentence_model.encode([question], convert_to_numpy=True)
        scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
        best_idx = np.argmax(scores)
        if scores[best_idx] > 0.65:
            responses.append(f"🔍 From dataset: {DATASET_ROWS[best_idx]}")

    # 3. Web fallback
    if not responses:
        web_answer = enhanced_search(question)
        responses.append(f"🌐 Web: {web_answer}")

    # 4. Final summarization (minimum 50 words)
    context = "\n".join(responses)
    if len(context.split()) < 50:
        context += "\n\n(Note: The information provided is based on the most relevant match and may be summarized.)"

    return context
