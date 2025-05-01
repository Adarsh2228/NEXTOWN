




# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from utils.analytics_main import analyze_business_type, initialize_models, ask_question, precompute_dataset_embeddings
# import pandas as pd
# import base64

# app = Flask(__name__)
# CORS(app)

# # Load data and precompute embeddings at startup
# df = pd.read_csv('./utils/indian_business_performance_data.csv')
# initialize_models()
# precompute_dataset_embeddings(df)

# @app.route("/api/analyze", methods=["POST"])
# def analyze():
#     data = request.get_json()
#     business_type = data.get('businessType')
#     if not business_type:
#         return jsonify({"error": "Business type is required"}), 400
#     try:
#         results, figures = analyze_business_type(df, business_type)
#         # Convert figures to base64 PNGs
#         base64_figures = {}
#         for key, fig in figures.items():
#             img_bytes = fig.to_image(format="png")
#             base64_str = base64.b64encode(img_bytes).decode("utf-8")
#             base64_figures[key] = f"data:image/png;base64,{base64_str}"
#         return jsonify({**results, "figures": base64_figures})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# @app.route('/api/ask', methods=["POST"])
# def ask():
#     data = request.get_json()
#     question = data.get('question', '').strip()
#     insights = data.get('graph_insights', {})
#     if not question:
#         return jsonify({"error": "Empty question"}), 400
#     try:
#         answer = ask_question(df, question, insights)
#         return jsonify({"answer": answer})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000, threaded=True)







# # app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import numpy as np
# import base64
# import plotly.express as px
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import os
# from dotenv import load_dotenv

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# # Global variables
# DATASET_ROWS = None
# DATASET_EMBEDDINGS = None
# SENTENCE_MODEL = None
# DF = None


# def load_data():
#     global DF
#     print("\n[1/3] Loading dataset...")
#     try:
#         DF = pd.read_csv('./utils/indian_business_performance_data.csv')

#         # Convert columns to standard Python float types
#         DF['Revenue'] = DF['Revenue'].astype(float)
#         DF['Profit'] = DF['Profit'].astype(float)
#         DF['Customer Rating'] = DF['Customer Rating'].astype(float)
#         DF['Sentiment Score'] = DF['Sentiment Score'].astype(float)

#         print(f"✅ Dataset loaded ({len(DF)} rows)")
#     except Exception as e:
#         print(f"Error loading dataset: {e}")
#         raise


# def initialize_models():
#     global SENTENCE_MODEL
#     print("\n[2/3] Loading AI models...")
#     SENTENCE_MODEL = SentenceTransformer('paraphrase-MiniLM-L3-v2')
#     print("✅ Models loaded")


# def precompute_embeddings():
#     global DATASET_ROWS, DATASET_EMBEDDINGS
#     print("\n[3/3] Computing embeddings...")
#     DATASET_ROWS = DF.astype(str).apply(' | '.join, axis=1).tolist()
#     DATASET_EMBEDDINGS = SENTENCE_MODEL.encode(DATASET_ROWS, convert_to_numpy=True)
#     print("✅ Embeddings ready")


# def convert_numpy(obj):
#     """Recursively convert numpy types to native Python types for JSON serialization"""
#     if isinstance(obj, dict):
#         return {k: convert_numpy(v) for k, v in obj.items()}
#     elif isinstance(obj, list):
#         return [convert_numpy(v) for v in obj]
#     elif isinstance(obj, np.integer):
#         return int(obj)
#     elif isinstance(obj, np.floating):
#         return float(obj)
#     elif isinstance(obj, np.ndarray):
#         return obj.tolist()
#     else:
#         return obj


# def analyze_business_type(df, business_type):
#     """Fixed analysis function with proper type conversion"""
#     filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
#     if filtered.empty:
#         raise ValueError(f"No data found for: {business_type}")

#     filtered['Month'] = pd.to_datetime(filtered['Date']).dt.month_name()

#     # Convert to Python native types
#     total_revenue = float(filtered['Revenue'].sum())
#     avg_monthly = float(filtered.groupby('Month')['Revenue'].mean().mean())
#     peak_month = str(filtered.groupby('Month')['Revenue'].mean().idxmax())
#     best_season = str(filtered.groupby('Season')['Revenue'].mean().idxmax())
#     avg_sentiment = float(filtered['Sentiment Score'].mean())
#     profit_margin = float((filtered['Profit'].sum() / filtered['Revenue'].sum()) * 100)

#     summary = {
#         "Total Revenue": total_revenue,
#         "Average Monthly Revenue": avg_monthly,
#         "Peak Month": peak_month,
#         "Best Season": best_season,
#         "Average Sentiment Score": round(avg_sentiment, 2),
#         "Profit Margin": round(profit_margin, 2)
#     }

#     # Generate figures
#     monthly = filtered.groupby('Month')['Revenue'].mean().reset_index()
#     seasonal = filtered.groupby('Season')['Revenue'].mean().reset_index()

#     figures = {}
#     try:
#         figures['monthly_revenue'] = px.line(monthly, x='Month', y='Revenue', title='Monthly Revenue')
#         figures['seasonal_revenue'] = px.bar(seasonal, x='Season', y='Revenue', color='Season', title='Seasonal Revenue')
#         figures['sentiment_distribution'] = px.histogram(filtered, x='Sentiment Score', nbins=10, title='Sentiment Analysis')
#         figures['rating_distribution'] = px.histogram(filtered, x='Customer Rating', nbins=10, title='Customer Ratings')
#     except Exception as e:
#         print(f"Error generating figures: {e}")

#     insights = {
#         "revenue_interpretation": f"Peak revenue in {peak_month} (₹{monthly['Revenue'].max():,.0f})" if not monthly.empty else "No monthly revenue data available.",
#         "sentiment_interpretation": f"Average sentiment: {avg_sentiment:.1f}/5",
#         "seasonal_interpretation": f"Best season: {best_season} (₹{seasonal['Revenue'].max():,.0f})" if not seasonal.empty else "No seasonal revenue data available.",
#         "rating_interpretation": f"Average rating: {filtered['Customer Rating'].mean():.1f}/5",
#         "business_insights": f"Total revenue: ₹{total_revenue:,.0f} | Profit margin: {profit_margin:.1f}%"
#     }

#     return {"summary": summary, **insights}, figures


# @app.route("/api/analyze", methods=["POST"])
# def analyze():
#     try:
#         data = request.get_json()
#         business_type = data.get('businessType', '').strip()

#         if not business_type:
#             return jsonify({"error": "Business type required"}), 400

#         results, figures = analyze_business_type(DF, business_type)

#         # Convert figures to base64
#         base64_figures = {}
#         if figures:  # Check if figures is not None and not empty
#             for key, fig in figures.items():
#                 img = fig.to_image(format="png")
#                 base64_str = base64.b64encode(img).decode('utf-8')
#                 base64_figures[key] = f"data:image/png;base64,{base64_str}"

#         # Convert all NumPy types in the response
#         return jsonify(convert_numpy({**results, "figures": base64_figures}))

#     except ValueError as ve:
#         return jsonify({"error": str(ve)}), 400
#     except Exception as e:
#         return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


# @app.route("/api/ask", methods=["POST"])
# def ask():
#     try:
#         data = request.get_json()
#         question = data.get('question', '').strip()

#         if not question:
#             return jsonify({"error": "Question required"}), 400

#         # Get insights from request
#         insights = data.get('graph_insights', {})

#         # Encode question and compute similarity
#         q_embedding = SENTENCE_MODEL.encode([question])
#         sim_scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]

#         if np.max(sim_scores) > 0.65:
#             answer = f"🔍 {DATASET_ROWS[np.argmax(sim_scores)]}"
#         else:
#             # Check insights if no dataset match
#             insight_texts = list(insights.values())
#             if insight_texts:
#                 insight_embeddings = SENTENCE_MODEL.encode(insight_texts)
#                 insight_scores = cosine_similarity(q_embedding, insight_embeddings)[0]
#                 if np.max(insight_scores) > 0.7:
#                     answer = f"📊 {insight_texts[np.argmax(insight_scores)]}"
#                 else:
#                     answer = "🤔 I couldn't find a relevant answer in the data."
#             else:
#                 answer = "❌ No analysis data available to answer this question."

#         return jsonify({"answer": answer})

#     except Exception as e:
#         return jsonify({"error": f"Question processing failed: {str(e)}"}), 500


# if __name__ == "__main__":
#     print("\n🚀 Starting Flask server...")
#     try:
#         load_data()
#         initialize_models()
#         precompute_embeddings()
#         app.run(host="0.0.0.0", port=5000, threaded=True)
#     except Exception as e:
#         print(f"Startup error: {e}")




# from flask import Flask, request, jsonify
# from flask_cors import CORS, cross_origin
# import pandas as pd
# import numpy as np
# import base64
# import plotly.express as px
# from dotenv import load_dotenv
# import os

# from utils.ask import ask_question, precompute_dataset_embeddings  # ✅ Import from ask.py

# # Load .env for API keys
# load_dotenv()

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# # Globals
# DF = None
# DATASET_ROWS = None
# DATASET_EMBEDDINGS = None


# def load_data():
#     global DF
#     print("\n[1/3] Loading dataset...")
#     try:
#         DF = pd.read_csv('./utils/indian_business_performance_data.csv')
#         DF['Revenue'] = DF['Revenue'].astype(float)
#         DF['Profit'] = DF['Profit'].astype(float)
#         DF['Customer Rating'] = DF['Customer Rating'].astype(float)
#         DF['Sentiment Score'] = DF['Sentiment Score'].astype(float)
#         print(f"✅ Dataset loaded: {len(DF)} rows")
#     except Exception as e:
#         print(f"❌ Error loading dataset: {e}")
#         raise


# def precompute_embeddings():
#     print("\n[2/3] Precomputing embeddings with ask.py...")
#     try:
#         precompute_dataset_embeddings(DF)
#         print("✅ Embeddings ready")
#     except Exception as e:
#         print(f"❌ Embedding error: {e}")
#         raise


# def convert_numpy(obj):
#     if isinstance(obj, dict):
#         return {k: convert_numpy(v) for k, v in obj.items()}
#     elif isinstance(obj, list):
#         return [convert_numpy(v) for v in obj]
#     elif isinstance(obj, np.integer):
#         return int(obj)
#     elif isinstance(obj, np.floating):
#         return float(obj)
#     elif isinstance(obj, np.ndarray):
#         return obj.tolist()
#     else:
#         return obj


# def analyze_business_type(df, business_type):
#     filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
#     if filtered.empty:
#         raise ValueError(f"No data found for: {business_type}")

#     filtered['Month'] = pd.to_datetime(filtered['Date']).dt.month_name()

#     total_revenue = float(filtered['Revenue'].sum())
#     avg_monthly = float(filtered.groupby('Month')['Revenue'].mean().mean())
#     peak_month = str(filtered.groupby('Month')['Revenue'].mean().idxmax())
#     best_season = str(filtered.groupby('Season')['Revenue'].mean().idxmax())
#     avg_sentiment = float(filtered['Sentiment Score'].mean())
#     profit_margin = float((filtered['Profit'].sum() / filtered['Revenue'].sum()) * 100)

#     summary = {
#         "Total Revenue": total_revenue,
#         "Average Monthly Revenue": avg_monthly,
#         "Peak Month": peak_month,
#         "Best Season": best_season,
#         "Average Sentiment Score": round(avg_sentiment, 2),
#         "Profit Margin": round(profit_margin, 2)
#     }

#     figures = {}
#     try:
#         monthly = filtered.groupby('Month')['Revenue'].mean().reset_index()
#         seasonal = filtered.groupby('Season')['Revenue'].mean().reset_index()

#         figures['monthly_revenue'] = px.line(monthly, x='Month', y='Revenue', title='Monthly Revenue')
#         figures['seasonal_revenue'] = px.bar(seasonal, x='Season', y='Revenue', title='Seasonal Revenue')
#         figures['sentiment_distribution'] = px.histogram(filtered, x='Sentiment Score', nbins=10, title='Sentiment Analysis')
#         figures['rating_distribution'] = px.histogram(filtered, x='Customer Rating', nbins=10, title='Customer Ratings')
#     except Exception as e:
#         print(f"❌ Error generating figures: {e}")

#     insights = {
#         "revenue_interpretation": f"Peak revenue in {peak_month} (₹{monthly['Revenue'].max():,.0f})" if not monthly.empty else "No monthly revenue data.",
#         "sentiment_interpretation": f"Average sentiment: {avg_sentiment:.1f}/5",
#         "seasonal_interpretation": f"Best season: {best_season} (₹{seasonal['Revenue'].max():,.0f})" if not seasonal.empty else "No seasonal revenue.",
#         "rating_interpretation": f"Avg rating: {filtered['Customer Rating'].mean():.1f}/5",
#         "business_insights": f"Total revenue: ₹{total_revenue:,.0f} | Profit margin: {profit_margin:.1f}%"
#     }

#     return {"summary": summary, **insights}, figures


# @app.route("/api/analyze", methods=["POST", "OPTIONS"])
# @cross_origin(origin="http://localhost:3000")
# def analyze():
#     if request.method == "OPTIONS":
#         return '', 200  # CORS preflight

#     try:
#         data = request.get_json()
#         business_type = data.get("businessType", "").strip()

#         if not business_type:
#             return jsonify({"error": "Business type required"}), 400

#         results, figures = analyze_business_type(DF, business_type)

#         base64_figures = {}
#         for key, fig in figures.items():
#             img = fig.to_image(format="png")
#             base64_figures[key] = f"data:image/png;base64,{base64.b64encode(img).decode()}"

#         return jsonify(convert_numpy({**results, "figures": base64_figures}))

#     except ValueError as ve:
#         return jsonify({"error": str(ve)}), 400
#     except Exception as e:
#         return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


# @app.route("/api/ask", methods=["POST"])
# @cross_origin(origin="http://localhost:3000")
# def ask():
#     data = request.get_json()
#     question = data.get('question')
#     insights = data.get('graph_insights', {})

#     if not question:
#         return jsonify({"error": "Question is required"}), 400

#     try:
#         answer = ask_question(DF, question, insights)
#         return jsonify({"answer": answer})
#     except Exception as e:
#         print(f"Error during question answering: {e}")
#         return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     print("\n🚀 Starting Flask server...")
#     try:
#         load_data()
#         precompute_embeddings()
#         app.run(host="0.0.0.0", port=5000, threaded=True)
#     except Exception as e:
#         print(f"Startup error: {e}")





from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import base64
import plotly.express as px
from dotenv import load_dotenv
from datetime import timedelta
from threading import Lock, Thread
import os

from utils.ask import ask_question, precompute_dataset_embeddings

load_dotenv()

app = Flask(__name__)
CORS(app,
     resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- Global Lazy Data ---
DF = None
EMBEDDINGS_READY = False
df_lock = Lock()

def get_dataset():
    global DF, EMBEDDINGS_READY
    with df_lock:
        if DF is None:
            print("\n📥 Lazy-loading dataset...")
            try:
                DF = pd.read_csv('./utils/indian_business_performance_data.csv')
                DF['Revenue'] = DF['Revenue'].astype(float)
                DF['Profit'] = DF['Profit'].astype(float)
                DF['Customer Rating'] = DF['Customer Rating'].astype(float)
                DF['Sentiment Score'] = DF['Sentiment Score'].astype(float)
                print(f"✅ Dataset loaded: {len(DF)} rows")
            except Exception as e:
                print(f"❌ Error loading dataset: {e}")
                raise

        if not EMBEDDINGS_READY:
            print("📊 Precomputing embeddings...")
            try:
                precompute_dataset_embeddings(DF)
                EMBEDDINGS_READY = True
                print("✅ Embeddings ready")
            except Exception as e:
                print(f"❌ Embedding error: {e}")
                raise
    return DF

def convert_numpy(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(v) for v in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj
def analyze_business_type(df, business_type):
    filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
    if filtered.empty:
        raise ValueError(f"No data found for: {business_type}")

    filtered['Month'] = pd.to_datetime(filtered['Date']).dt.month_name()

    total_revenue = float(filtered['Revenue'].sum())
    avg_monthly = float(filtered.groupby('Month')['Revenue'].mean().mean())
    peak_month = str(filtered.groupby('Month')['Revenue'].mean().idxmax())
    best_season = str(filtered.groupby('Season')['Revenue'].mean().idxmax())
    avg_sentiment = float(filtered['Sentiment Score'].mean())
    profit_margin = float((filtered['Profit'].sum() / filtered['Revenue'].sum()) * 100)

    summary = {
        "Total Revenue": total_revenue,
        "Average Monthly Revenue": avg_monthly,
        "Peak Month": peak_month,
        "Best Season": best_season,
        "Average Sentiment Score": round(avg_sentiment, 2),
        "Profit Margin": round(profit_margin, 2)
    }

    figures = {}
    try:
        monthly = filtered.groupby('Month', observed=False).agg({'Revenue': 'mean', 'Profit': 'mean'}).reset_index()
        seasonal = filtered.groupby('Season', observed=False).agg({'Revenue': 'mean', 'Profit': 'mean'}).reset_index()

        figures['monthly_revenue'] = px.line(monthly, x='Month', y='Revenue', title='Monthly Revenue')
        figures['seasonal_revenue'] = px.bar(seasonal, x='Season', y='Revenue', title='Seasonal Revenue')
        figures['monthly_profit'] = px.line(monthly, x='Month', y='Profit', title='Monthly Profit')
        figures['seasonal_profit'] = px.bar(seasonal, x='Season', y='Profit', title='Seasonal Profit')
        figures['sentiment_distribution'] = px.histogram(filtered, x='Sentiment Score', nbins=10, title='Sentiment Analysis')
        figures['rating_distribution'] = px.histogram(filtered, x='Customer Rating', nbins=10, title='Customer Ratings')
        figures['revenue_vs_rating'] = px.scatter(filtered, x='Customer Rating', y='Revenue', title='Revenue vs Customer Rating')
        figures['revenue_vs_sentiment'] = px.scatter(filtered, x='Sentiment Score', y='Revenue', title='Revenue vs Sentiment Score')

    except Exception as e:
        print(f"❌ Error generating figures: {e}")

    insights = {
        "revenue_interpretation": f"Peak revenue in {peak_month} (₹{monthly['Revenue'].max():,.0f})" if not monthly.empty else "No monthly revenue data.",
        "sentiment_interpretation": f"Average sentiment: {avg_sentiment:.1f}/5",
        "seasonal_interpretation": f"Best season: {best_season} (₹{seasonal['Revenue'].max():,.0f})" if not seasonal.empty else "No seasonal revenue.",
        "rating_interpretation": f"Avg rating: {filtered['Customer Rating'].mean():.1f}/5",
        "business_insights": f"Total revenue: ₹{total_revenue:,.0f} | Profit margin: {profit_margin:.1f}%"
    }

    return {"summary": summary, **insights}, figures


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    return response

@app.route("/api/analyze", methods=["POST", "OPTIONS"])
def analyze():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.get_json()
        business_type = data.get("businessType", "").strip()

        if not business_type:
            return jsonify({"error": "Business type required"}), 400

        df = get_dataset()
        results, figures = analyze_business_type(df, business_type)

        base64_figures = {}
        for key, fig in figures.items():
            img = fig.to_image(format="png")
            base64_figures[key] = f"data:image/png;base64,{base64.b64encode(img).decode()}"

        return jsonify(convert_numpy({**results, "figures": base64_figures}))

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@app.route("/api/ask", methods=["POST", "OPTIONS"])
def ask():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    question = data.get('question')
    insights = data.get('graph_insights', {})

    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        df = get_dataset()
        answer = ask_question(df, question, insights)
        return jsonify({"answer": answer})
    except Exception as e:
        print(f"Error during question answering: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/ping")
def ping():
    return "pong", 200

# ---- Background loader for dataset after Flask starts ----
def preload_dataset_background():
    try:
        print("🧠 Starting background dataset preload...")
        get_dataset()
        print("✅ Background preload done")
    except Exception as e:
        print(f"❌ Error in preload: {e}")

if __name__ == "__main__":
    print("\n🚀 Starting Flask server...")
    try:
        # Start dataset preload in background
        Thread(target=preload_dataset_background, daemon=True).start()

        # Start Flask server
        app.run(host="0.0.0.0", port=5000, debug=True)
    except Exception as e:
        print(f"Startup error: {e}")
