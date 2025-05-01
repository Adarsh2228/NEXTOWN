
# import os
# import time
# import requests
# import numpy as np
# import pandas as pd
# import plotly.express as px
# import plotly.graph_objects as go
# from dotenv import load_dotenv
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity

# load_dotenv()

# # Load API keys from .env
# SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
# SCRAPERAPI_API_KEY = os.getenv("SCRAPERAPI_API_KEY")

# # Globals
# sentence_model = SentenceTransformer("paraphrase-MiniLM-L3-v2")
# DATASET_ROWS, DATASET_EMBEDDINGS = None, None

# def initialize_models():
#     return None, sentence_model

# def precompute_dataset_embeddings(df):
#     global DATASET_ROWS, DATASET_EMBEDDINGS
#     DATASET_ROWS = df.astype(str).apply(lambda row: " | ".join(row), axis=1).tolist()
#     DATASET_EMBEDDINGS = sentence_model.encode(DATASET_ROWS, convert_to_numpy=True)

# def analyze_business_type(df, business_type):
#     filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
#     if filtered.empty:
#         raise ValueError("No data found for this business type.")

#     filtered["Month"] = pd.to_datetime(filtered["Date"]).dt.month_name()

#     total_revenue = filtered["Revenue"].sum()
#     total_profit = filtered["Profit"].sum()
#     avg_sentiment = round(filtered["Sentiment Score"].mean(), 2)
#     avg_rating = round(filtered["Customer Rating"].mean(), 2)
#     profit_margin = round((total_profit / total_revenue) * 100, 2) if total_revenue > 0 else 0

#     monthly_data = filtered.groupby("Month")["Revenue"].mean().reset_index()
#     seasonal_data = filtered.groupby("Season")["Revenue"].mean().reset_index()

#     # Figures
#     figures = {
#         "monthly_revenue": create_plot(px.line(monthly_data, x="Month", y="Revenue", title="Monthly Revenue")),
#         "seasonal_revenue": create_plot(px.bar(seasonal_data, x="Season", y="Revenue", color="Season", title="Seasonal Revenue")),
#         "sentiment_distribution": create_plot(px.histogram(filtered, x="Sentiment Score", nbins=10, title="Sentiment Score Distribution")),
#         "rating_distribution": create_plot(px.histogram(filtered, x="Customer Rating", nbins=10, title="Customer Ratings"))
#     }

#     # Descriptions
#     insights = {
#         "revenue_interpretation": f"{monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month']} shows the highest monthly revenue." if not monthly_data.empty else "No data.",
#         "sentiment_interpretation": f"Average sentiment is {avg_sentiment}/5.",
#         "seasonal_interpretation": f"{seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season']} is the most profitable season." if not seasonal_data.empty else "No data.",
#         "rating_interpretation": f"Average rating is {avg_rating}/5.",
#         "business_insights": (
#             f"{monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month']} and "
#             f"{seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season']} are peak periods. "
#             f"Sentiment: {avg_sentiment}/5. Rating: {avg_rating}/5. "
#             f"Revenue: ₹{total_revenue:,}. Margin: {profit_margin}%."
#         )
#     }

#     return {
#         "summary": {
#             "Total Revenue": int(total_revenue),
#             "Average Monthly Revenue": int(monthly_data["Revenue"].mean()),
#             "Peak Month": monthly_data.loc[monthly_data["Revenue"].idxmax(), "Month"] if not monthly_data.empty else "N/A",
#             "Best Season": seasonal_data.loc[seasonal_data["Revenue"].idxmax(), "Season"] if not seasonal_data.empty else "N/A",
#             "Average Sentiment Score": avg_sentiment,
#             "Profit Margin": profit_margin
#         },
#         **insights
#     }, figures

# def create_plot(fig):
#     fig.update_layout(margin=dict(l=20, r=20, t=50, b=20))
#     return fig

# def enhanced_search(question):
#     if SERPAPI_API_KEY:
#         return run_serpapi(question)
#     elif SCRAPERAPI_API_KEY:
#         return run_scraperapi(question)
#     else:
#         return "⚠️ No valid search API keys found. Please contact support."

# def run_serpapi(question):
#     try:
#         response = requests.get(
#             "https://serpapi.com/search",
#             params={
#                 "q": question,
#                 "api_key": SERPAPI_API_KEY,
#                 "engine": "google",
#                 "num": 5
#             },
#             timeout=10
#         )
#         response.raise_for_status()
#         data = response.json()

#         if "organic_results" in data and len(data["organic_results"]) > 0:
#             links = []
#             for item in data["organic_results"]:
#                 title = item.get("title", "View Source")
#                 link = item.get("link", "#")
#                 links.append(f"<li><a href='{link}' target='_blank' rel='noopener noreferrer'>{title}</a></li>")

#             link_block = "<ul>" + "\n".join(links) + "</ul>"
#             return (
#                 "🌐 Based on your question, here are some helpful sources from the web:<br/><br/>"
#                 f"{link_block}<br/>"
#                 "Click any link above to explore more in detail. Let me know if you'd like a summary!"
#             )

#         return "🌐 No relevant web results were found at the moment. Try rephrasing the question."

#     except Exception as e:
#         return f"❌ Web search failed due to: {str(e)}"


# def run_scraperapi(question):
#     try:
#         response = requests.get(
#             f"http://api.scraperapi.com",
#             params={
#                 "api_key": SCRAPERAPI_API_KEY,
#                 "url": f"https://www.google.com/search?q={question}"
#             },
#             timeout=20
#         )
#         return "🔍 Results may vary - check manually." if response.ok else "❌ No results."
#     except Exception as e:
#         return f"❌ ScraperAPI error: {str(e)}"

# def ask_question(df, question, graph_insights):
#     # 1. Graph-based search
#     if graph_insights:
#         graph_texts = list(graph_insights.values())
#         graph_embeddings = sentence_model.encode(graph_texts, convert_to_numpy=True)
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         similarity = cosine_similarity(q_embedding, graph_embeddings)[0]
#         best_idx = np.argmax(similarity)
#         if similarity[best_idx] > 0.7:
#             return f"📊 {graph_texts[best_idx]}"

#     # 2. Dataset search
#     if DATASET_EMBEDDINGS is not None:
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
#         best_idx = np.argmax(scores)
#         if scores[best_idx] > 0.65:
#             return f"🔍 {DATASET_ROWS[best_idx]}"

#     # 3. API fallback
#     return enhanced_search(question)
















# utils/analytics_main.py

import os
import requests
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import HuggingFaceLLM
from llama_index.embeddings import HuggingFaceEmbedding

load_dotenv()

SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
SCRAPERAPI_API_KEY = os.getenv("SCRAPERAPI_API_KEY")

sentence_model = SentenceTransformer("paraphrase-MiniLM-L3-v2")
DATASET_ROWS, DATASET_EMBEDDINGS = None, None
LLM_INDEX = None

# LLM Setup
def initialize_llm_index(text_chunks):
    embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    llm = HuggingFaceLLM(model_name="mistralai/Mistral-7B-Instruct-v0.1", device_map="auto", tokenizer_kwargs={"use_fast": True})
    context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model)
    return VectorStoreIndex.from_documents(text_chunks, service_context=context)

def initialize_models():
    return None, sentence_model

def precompute_dataset_embeddings(df):
    global DATASET_ROWS, DATASET_EMBEDDINGS, LLM_INDEX
    DATASET_ROWS = df.astype(str).apply(lambda row: " | ".join(row), axis=1).tolist()
    DATASET_EMBEDDINGS = sentence_model.encode(DATASET_ROWS, convert_to_numpy=True)
    
    # Create LLM index
    from llama_index import Document
    text_chunks = [Document(text=row) for row in DATASET_ROWS]
    LLM_INDEX = initialize_llm_index(text_chunks)

def summarize_with_llm(prompt):
    if LLM_INDEX:
        query_engine = LLM_INDEX.as_query_engine()
        return query_engine.query(prompt).response
    return "⚠️ LLM unavailable."

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
                return "\n".join([res.get("snippet", "") for res in data["organic_results"][:3]])
        return "No good Google result found."
    except Exception as e:
        return f"❌ Web search failed: {e}"

def ask_question(df, question, graph_insights):
    responses = []

    # 1. Graph insights
    if graph_insights:
        graph_texts = list(graph_insights.values())
        graph_embeddings = sentence_model.encode(graph_texts, convert_to_numpy=True)
        q_embedding = sentence_model.encode([question], convert_to_numpy=True)
        similarity = cosine_similarity(q_embedding, graph_embeddings)[0]
        best_idx = np.argmax(similarity)
        if similarity[best_idx] > 0.7:
            responses.append(f"📊 {graph_texts[best_idx]}")

    # 2. Dataset
    if DATASET_EMBEDDINGS is not None:
        q_embedding = sentence_model.encode([question], convert_to_numpy=True)
        scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
        best_idx = np.argmax(scores)
        if scores[best_idx] > 0.65:
            responses.append(f"🔍 {DATASET_ROWS[best_idx]}")

    # 3. Web Fallback
    if not responses:
        web_snippet = enhanced_search(question)
        responses.append(f"🌐 {web_snippet}")

    # 4. Final LLM Summarization
    combined_context = "\n".join(responses)
    final_response = summarize_with_llm(f"Question: {question}\n\nContext:\n{combined_context}\n\nAnswer the question in simple terms:")
    return final_response
