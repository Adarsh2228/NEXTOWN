# import pandas as pd
# import plotly.express as px
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# import requests
# import os
# from time import sleep
# from dotenv import load_dotenv
# import plotly.graph_objects as go  # Import for creating empty figures

# load_dotenv()

# # Global cache
# sentence_model = None
# DATASET_ROWS = None
# DATASET_EMBEDDINGS = None

# # API Configuration
# SEARCH_API = "serpapi"  # Options: serpapi, scraperapi
# API_CONFIG = {
#     "serpapi": {
#         "url": "https://serpapi.com/search",
#         "key": os.getenv("SERPAPI_API_KEY"),
#         "timeout": 10,
#         "engine": "google"
#     },
#     "scraperapi": {
#         "url": "http://api.scraperapi.com",
#         "key": os.getenv("SCRAPERAPI_KEY"),
#         "timeout": 20
#     }
# }

# def initialize_models():
#     global sentence_model
#     sentence_model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
#     return None, sentence_model

# def precompute_dataset_embeddings(df):
#     global DATASET_ROWS, DATASET_EMBEDDINGS
#     DATASET_ROWS = df.astype(str).apply(lambda x: ' | '.join(x), axis=1).tolist()
#     DATASET_EMBEDDINGS = sentence_model.encode(DATASET_ROWS, convert_to_numpy=True)

# def create_empty_figure(title="No Data Available"):
#     """Creates an empty Plotly figure with a specified title."""
#     fig = go.Figure(data=[go.Scatter(x=[], y=[])])
#     fig.update_layout(
#         title=title,
#         xaxis=dict(visible=False),
#         yaxis=dict(visible=False),
#         annotations=[
#             dict(
#                 text="No data to display",
#                 xref="paper",
#                 yref="paper",
#                 showarrow=False,
#                 font=dict(size=20)
#             )
#         ]
#     )
#     return fig


# def analyze_business_type(df, business_type):
#     filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
#     if filtered.empty:
#         raise ValueError("No data found for this business type.")

#     filtered.loc[:, 'Month'] = pd.to_datetime(filtered['Date']).dt.month_name()

#     try:
#         total_revenue = filtered['Revenue'].sum()
#         total_profit = filtered['Profit'].sum()

#         summary = {
#             "Total Revenue": int(total_revenue),
#             "Average Monthly Revenue": int(filtered.groupby('Month')['Revenue'].mean().mean()),
#             "Peak Month": filtered.groupby('Month')['Revenue'].sum().idxmax(),
#             "Best Season": filtered.groupby('Season')['Revenue'].mean().idxmax(),
#             "Average Sentiment Score": round(filtered['Sentiment Score'].mean(), 2),
#             "Profit Margin": round((total_profit / total_revenue) * 100, 2) if total_revenue > 0 else 0
#         }
#     except Exception as e:
#         print(f"Error calculating summary: {e}")
#         raise

#     figures, descriptions = {}, {}

#     # Monthly Revenue
#     monthly_data = filtered.groupby('Month')['Revenue'].mean().reset_index()
#     try:
#         fig1 = px.line(monthly_data, x='Month', y='Revenue', title='Monthly Revenue')
#     except Exception as e:
#         print(f"Error generating monthly revenue figure: {e}")
#         fig1 = create_empty_figure("Monthly Revenue: Error Generating Plot")  # Use empty figure
#     figures['monthly_revenue'] = fig1
#     descriptions['monthly_revenue'] = f"{monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month']} shows the highest monthly revenue." if not monthly_data.empty else "No monthly revenue data available."

#     # Seasonal Revenue
#     seasonal_data = filtered.groupby('Season')['Revenue'].mean().reset_index()
#     try:
#         fig2 = px.bar(seasonal_data, x='Season', y='Revenue', color='Season', title='Seasonal Revenue')
#     except Exception as e:
#         print(f"Error generating seasonal revenue figure: {e}")
#         fig2 = create_empty_figure("Seasonal Revenue: Error Generating Plot")  # Use empty figure
#     figures['seasonal_revenue'] = fig2
#     descriptions['seasonal_revenue'] = f"{seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season']} is the most profitable season." if not seasonal_data.empty else "No seasonal revenue data available."

#     # Sentiment Score
#     try:
#         fig3 = px.histogram(filtered, x='Sentiment Score', nbins=10, title='Sentiment Score Distribution')
#     except Exception as e:
#         print(f"Error generating sentiment distribution figure: {e}")
#         fig3 = create_empty_figure("Sentiment Distribution: Error Generating Plot")  # Use empty figure
#     figures['sentiment_distribution'] = fig3
#     avg_sentiment = round(filtered['Sentiment Score'].mean(), 2)
#     descriptions['sentiment_distribution'] = f"Average sentiment is {avg_sentiment}."

#     # Customer Ratings
#     try:
#         fig4 = px.histogram(filtered, x='Customer Rating', nbins=10, title='Customer Ratings')
#     except Exception as e:
#         print(f"Error generating customer ratings figure: {e}")
#         fig4 = create_empty_figure("Customer Ratings: Error Generating Plot")  # Use empty figure
#     figures['rating_distribution'] = fig4
#     avg_rating = round(filtered['Customer Rating'].mean(), 2)
#     descriptions['rating_distribution'] = f"Average rating is {avg_rating} stars."

#     # Check for empty DataFrames before accessing .loc
#     peak_month = monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month'] if not monthly_data.empty else "N/A"
#     best_season = seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season'] if not seasonal_data.empty else "N/A"
    
#     overall_summary = (
#         f"{peak_month} and "
#         f"{best_season} are peak periods. "
#         f"Sentiment: {avg_sentiment}/5. Rating: {avg_rating}/5. "
#         f"Revenue: ₹{summary['Total Revenue']:,}. Margin: {summary['Profit Margin']}%."
#     )

#     insights = {
#         "revenue_interpretation": descriptions.get('monthly_revenue', 'No data'),
#         "sentiment_interpretation": descriptions.get('sentiment_distribution', 'No data'),
#         "seasonal_interpretation": descriptions.get('seasonal_revenue', 'No data'),
#         "rating_interpretation": descriptions.get('rating_distribution', 'No data'),
#         "business_insights": overall_summary
#     }

#     return {
#         "summary": summary,
#         **insights
#     }, figures

# def enhanced_search(question, max_retries=3):
#     """Unified search interface with retry mechanism and clickable links."""
#     if SEARCH_API not in API_CONFIG:
#         return "⚠️ Invalid search API configuration"

#     config = API_CONFIG[SEARCH_API]
    
#     if SEARCH_API == "serpapi":
#         params = {
#             "q": question,
#             "api_key": config["key"],
#             "engine": config["engine"]
#         }
#     elif SEARCH_API == "scraperapi":
#         params = {
#             "api_key": config["key"],
#             "url": f"https://www.google.com/search?q={question}",
#             "render": "true"
#         }

#     for attempt in range(max_retries):
#         try:
#             res = requests.get(config["url"], params=params, timeout=config["timeout"])
#             res.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            
#             if SEARCH_API == "serpapi":
#                 data = res.json()
#                 # Prefer answer_box with a link if available (SerpAPI sometimes provides this)
#                 if "answer_box" in data:
#                     ab = data["answer_box"]
#                     if ab.get("link") and ab.get("title"):
#                         # Return as HTML anchor
#                         return f'🌐 <a href="{ab["link"]}" target="_blank" rel="noopener noreferrer">{ab["title"]}</a>'
#                     if ab.get("answer"):
#                         return f"🌐 {ab['answer']}"
#                 if organic := data.get("organic_results"):
#                     # Always return the title as a link
#                     title = organic[0].get('title', 'Source')
#                     link = organic[0].get('link', '#')
#                     return f'🌐 <a href="{link}" target="_blank" rel="noopener noreferrer">{title}</a>'
            
#             elif SEARCH_API == "scraperapi":
#                 # For actual HTML parsing, you would need BeautifulSoup.
#                 # Here, just return the Google search URL as a fallback.
#                 return f'🌐 <a href="https://www.google.com/search?q={question}" target="_blank" rel="noopener noreferrer">Google Search Results</a>'
            
#             return "🌐 No relevant results found"
        
#         except requests.exceptions.RequestException as e:
#             sleep(2 ** attempt)  # Exponential backoff
#             if attempt == max_retries - 1:
#                 return f"⚠️ Search error: {str(e)}"
#         except Exception as e:
#             return f"⚠️ Error processing search results: {str(e)}"

# def ask_question(df, question, graph_insights):
#     # 1. Check graph insights
#     insight_texts = list(graph_insights.values())
#     if insight_texts:
#         insight_embeddings = sentence_model.encode(insight_texts, convert_to_numpy=True)
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         sim_scores = cosine_similarity(q_embedding, insight_embeddings)[0]
#         best_idx = np.argmax(sim_scores)
#         if sim_scores[best_idx] > 0.7:
#             return f"📊 {insight_texts[best_idx]}"

#     # 2. Search dataset
#     if DATASET_EMBEDDINGS is not None:
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         sim_scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
#         best_idx = np.argmax(sim_scores)
#         if sim_scores[best_idx] > 0.65:
#             return f"🔍 {DATASET_ROWS[best_idx]}"

#     # 3. Enhanced search fallback
#     return enhanced_search(question)





# import pandas as pd
# import plotly.express as px
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# import requests
# import os
# from time import sleep
# from dotenv import load_dotenv
# import plotly.graph_objects as go

# load_dotenv()

# # Global cache
# sentence_model = None
# DATASET_ROWS = None
# DATASET_EMBEDDINGS = None

# # API Configuration
# SEARCH_API = "serpapi"  # Options: serpapi, scraperapi
# API_CONFIG = {
#     "serpapi": {
#         "url": "https://serpapi.com/search",
#         "key": os.getenv("SERPAPI_API_KEY"),
#         "timeout": 10,
#         "engine": "google"
#     },
#     "scraperapi": {
#         "url": "http://api.scraperapi.com",
#         "key": os.getenv("SCRAPERAPI_KEY"),
#         "timeout": 20
#     }
# }

# def initialize_models():
#     global sentence_model
#     sentence_model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
#     return None, sentence_model

# def precompute_dataset_embeddings(df):
#     global DATASET_ROWS, DATASET_EMBEDDINGS
#     DATASET_ROWS = df.astype(str).apply(lambda x: ' | '.join(x), axis=1).tolist()
#     DATASET_EMBEDDINGS = sentence_model.encode(DATASET_ROWS, convert_to_numpy=True)

# def analyze_business_type(df, business_type):
#     filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
#     if filtered.empty:
#         raise ValueError("No data found for this business type.")

#     filtered.loc[:, 'Month'] = pd.to_datetime(filtered['Date']).dt.month_name()

#     try:
#         total_revenue = filtered['Revenue'].sum()
#         total_profit = filtered['Profit'].sum()

#         summary = {
#             "Total Revenue": int(total_revenue),
#             "Average Monthly Revenue": int(filtered.groupby('Month')['Revenue'].mean().mean()),
#             "Peak Month": filtered.groupby('Month')['Revenue'].sum().idxmax(),
#             "Best Season": filtered.groupby('Season')['Revenue'].mean().idxmax(),
#             "Average Sentiment Score": round(filtered['Sentiment Score'].mean(), 2),
#             "Profit Margin": round((total_profit / total_revenue) * 100, 2) if total_revenue > 0 else 0
#         }
#     except Exception as e:
#         print(f"Error calculating summary: {e}")
#         raise

#     figures, descriptions = {}, {}

#     # Monthly Revenue
#     monthly_data = filtered.groupby('Month')['Revenue'].mean().reset_index()
#     try:
#         fig1 = px.line(monthly_data, x='Month', y='Revenue', title='Monthly Revenue')
#     except Exception as e:
#         print(f"Error generating monthly revenue figure: {e}")
#         fig1 = create_empty_figure("Monthly Revenue: Error Generating Plot")
#     figures['monthly_revenue'] = fig1
#     descriptions['monthly_revenue'] = f"{monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month']} shows the highest monthly revenue." if not monthly_data.empty else "No monthly revenue data available."

#     # Seasonal Revenue
#     seasonal_data = filtered.groupby('Season')['Revenue'].mean().reset_index()
#     try:
#         fig2 = px.bar(seasonal_data, x='Season', y='Revenue', color='Season', title='Seasonal Revenue')
#     except Exception as e:
#         print(f"Error generating seasonal revenue figure: {e}")
#         fig2 = create_empty_figure("Seasonal Revenue: Error Generating Plot")
#     figures['seasonal_revenue'] = fig2
#     descriptions['seasonal_revenue'] = f"{seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season']} is the most profitable season." if not seasonal_data.empty else "No seasonal revenue data available."

#     # Sentiment Score
#     try:
#         fig3 = px.histogram(filtered, x='Sentiment Score', nbins=10, title='Sentiment Score Distribution')
#     except Exception as e:
#         print(f"Error generating sentiment distribution figure: {e}")
#         fig3 = create_empty_figure("Sentiment Distribution: Error Generating Plot")
#     figures['sentiment_distribution'] = fig3
#     avg_sentiment = round(filtered['Sentiment Score'].mean(), 2)
#     descriptions['sentiment_distribution'] = f"Average sentiment is {avg_sentiment}."

#     # Customer Ratings
#     try:
#         fig4 = px.histogram(filtered, x='Customer Rating', nbins=10, title='Customer Ratings')
#     except Exception as e:
#         print(f"Error generating customer ratings figure: {e}")
#         fig4 = create_empty_figure("Customer Ratings: Error Generating Plot")
#     figures['rating_distribution'] = fig4
#     avg_rating = round(filtered['Customer Rating'].mean(), 2)
#     descriptions['rating_distribution'] = f"Average rating is {avg_rating} stars."

#     # Check for empty DataFrames before accessing .loc
#     peak_month = monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month'] if not monthly_data.empty else "N/A"
#     best_season = seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season'] if not seasonal_data.empty else "N/A"
    
#     overall_summary = (
#         f"{peak_month} and "
#         f"{best_season} are peak periods. "
#         f"Sentiment: {avg_sentiment}/5. Rating: {avg_rating}/5. "
#         f"Revenue: ₹{summary['Total Revenue']:,}. Margin: {summary['Profit Margin']}%."
#     )

#     insights = {
#         "revenue_interpretation": descriptions.get('monthly_revenue', 'No data'),
#         "sentiment_interpretation": descriptions.get('sentiment_distribution', 'No data'),
#         "seasonal_interpretation": descriptions.get('seasonal_revenue', 'No data'),
#         "rating_interpretation": descriptions.get('rating_distribution', 'No data'),
#         "business_insights": overall_summary
#     }

#     return {
#         "summary": summary,
#         **insights
#     }, figures

# def create_empty_figure(title="No Data Available"):
#     """Creates an empty Plotly figure with a specified title."""
#     fig = go.Figure(data=[go.Scatter(x=[], y=[])])
#     fig.update_layout(
#         title=title,
#         xaxis=dict(visible=False),
#         yaxis=dict(visible=False),
#         annotations=[
#             dict(
#                 text="No data to display",
#                 xref="paper",
#                 yref="paper",
#                 showarrow=False,
#                 font=dict(size=20)
#             )
#         ]
#     )
#     return fig

# def enhanced_search(question, api_key, engine="google", max_retries=3):
#     """
#     Enhanced search to use different engines and retry mechanism.
#     """
#     url = "https://serpapi.com/search"
#     params = {
#         "q": question,
#         "api_key": api_key,
#         "engine": engine,
#         "num": 3  # Limiting the results
#     }
    
#     for attempt in range(max_retries):
#         try:
#             response = requests.get(url, params=params, timeout=10)
#             response.raise_for_status()  # Raises HTTPError for bad responses (4XX, 5XX)
#             search_results = response.json()

#             if search_results and search_results.get("organic_results"):
#                 results = search_results["organic_results"]
#                 if results:
#                     formatted_results = "\n".join(
#                         [f"🌐 <a href=\"{r['link']}\" target=\"_blank\" rel=\"noopener noreferrer\">{r['title']}</a>" for r in results]
#                     )
#                     return formatted_results
#             return "🌐 No relevant results found."  # No results found

#         except requests.exceptions.RequestException as e:
#             sleep(2 ** attempt)  # Exponential backoff
#             if attempt == max_retries - 1:
#                 return f"⚠️ Search error: {str(e)}"  # Last attempt failed

#         except Exception as e:
#             return f"⚠️ Error processing search results: {str(e)}"  # General error



# def ask_question(df, question, graph_insights):
#     # 1. Check graph insights
#     insight_texts = list(graph_insights.values())
#     if insight_texts:
#         insight_embeddings = sentence_model.encode(insight_texts, convert_to_numpy=True)
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         sim_scores = cosine_similarity(q_embedding, insight_embeddings)[0]
#         best_idx = np.argmax(sim_scores)
#         if sim_scores[best_idx] > 0.7:
#             return f"📊 {insight_texts[best_idx]}"

#     # 2. Search dataset
#     if DATASET_EMBEDDINGS is not None:
#         q_embedding = sentence_model.encode([question], convert_to_numpy=True)
#         sim_scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
#         best_idx = np.argmax(sim_scores)
#         if sim_scores[best_idx] > 0.65:
#             return f"🔍 {DATASET_ROWS[best_idx]}"

#     # 3. Enhanced search fallback
#     serpapi_api_key = os.getenv("SERPAPI_API_KEY")
#     if not serpapi_api_key:
#         return "⚠️ SERPAPI_API_KEY not set. Please configure."
#     return enhanced_search(question, serpapi_api_key)




import pandas as pd
import plotly.express as px
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import requests
import os
from time import sleep
from dotenv import load_dotenv
import plotly.graph_objects as go

# Load environment variables
load_dotenv()

# Global variables initialized once
sentence_model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
DATASET_ROWS = []
DATASET_EMBEDDINGS = None
FULL_DF = None

# API Configuration
SEARCH_API = "serpapi"
API_CONFIG = {
    "serpapi": {
        "url": "https://serpapi.com/search",
        "key": os.getenv("SERPAPI_API_KEY"),
        "timeout": 10,
        "engine": "google"
    },
    "scraperapi": {
        "url": "http://api.scraperapi.com",
        "key": os.getenv("SCRAPERAPI_KEY"),
        "timeout": 20
    }
}

def load_dataset_and_embeddings(path):
    global DATASET_ROWS, DATASET_EMBEDDINGS, FULL_DF

    df = pd.read_csv(path)
    FULL_DF = df.copy()
    DATASET_ROWS = df.astype(str).apply(lambda x: ' | '.join(x), axis=1).tolist()
    DATASET_EMBEDDINGS = sentence_model.encode(DATASET_ROWS, convert_to_numpy=True)

def create_empty_figure(title="No Data Available"):
    fig = go.Figure(data=[go.Scatter(x=[], y=[])])
    fig.update_layout(
        title=title,
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
        annotations=[{
            "text": "No data to display",
            "xref": "paper", "yref": "paper",
            "showarrow": False, "font": {"size": 20}
        }]
    )
    return fig

def analyze_business_type(df, business_type):
    filtered = df[df['Business Type'].str.lower() == business_type.lower()].copy()
    if filtered.empty:
        raise ValueError("No data found for this business type.")

    filtered['Month'] = pd.to_datetime(filtered['Date']).dt.month_name()

    total_revenue = filtered['Revenue'].sum()
    total_profit = filtered['Profit'].sum()

    summary = {
        "Total Revenue": int(total_revenue),
        "Average Monthly Revenue": int(filtered.groupby('Month')['Revenue'].mean().mean()),
        "Peak Month": filtered.groupby('Month')['Revenue'].sum().idxmax(),
        "Best Season": filtered.groupby('Season')['Revenue'].mean().idxmax(),
        "Average Sentiment Score": round(filtered['Sentiment Score'].mean(), 2),
        "Profit Margin": round((total_profit / total_revenue) * 100, 2) if total_revenue > 0 else 0
    }

    figures, descriptions = {}, {}

    # 1. Monthly Revenue
    monthly_data = filtered.groupby('Month')['Revenue'].mean().reset_index()
    try:
        fig1 = px.line(monthly_data, x='Month', y='Revenue', title='Monthly Revenue')
    except Exception:
        fig1 = create_empty_figure("Monthly Revenue: Error Generating Plot")
    figures['monthly_revenue'] = fig1
    descriptions['monthly_revenue'] = f"{monthly_data.loc[monthly_data['Revenue'].idxmax(), 'Month']} shows the highest monthly revenue."

    # 2. Seasonal Revenue
    seasonal_data = filtered.groupby('Season')['Revenue'].mean().reset_index()
    try:
        fig2 = px.bar(seasonal_data, x='Season', y='Revenue', color='Season', title='Seasonal Revenue')
    except Exception:
        fig2 = create_empty_figure("Seasonal Revenue: Error Generating Plot")
    figures['seasonal_revenue'] = fig2
    descriptions['seasonal_revenue'] = f"{seasonal_data.loc[seasonal_data['Revenue'].idxmax(), 'Season']} is the most profitable season."

    # 3. Sentiment Score Distribution
    try:
        fig3 = px.histogram(filtered, x='Sentiment Score', nbins=10, title='Sentiment Score Distribution')
    except Exception:
        fig3 = create_empty_figure("Sentiment Distribution: Error Generating Plot")
    figures['sentiment_distribution'] = fig3
    avg_sentiment = round(filtered['Sentiment Score'].mean(), 2)
    descriptions['sentiment_distribution'] = f"Average sentiment is {avg_sentiment}."

    # 4. Customer Ratings
    try:
        fig4 = px.histogram(filtered, x='Customer Rating', nbins=10, title='Customer Ratings')
    except Exception:
        fig4 = create_empty_figure("Customer Ratings: Error Generating Plot")
    figures['rating_distribution'] = fig4
    avg_rating = round(filtered['Customer Rating'].mean(), 2)
    descriptions['rating_distribution'] = f"Average rating is {avg_rating} stars."

    # 5. Marketing Spend vs Revenue
    try:
        fig5 = px.scatter(filtered, x='Marketing Spend', y='Revenue', title='Marketing Spend vs Revenue',
                          trendline='ols')
    except Exception:
        fig5 = create_empty_figure("Marketing vs Revenue")
    figures['marketing_vs_revenue'] = fig5

    # 6. Tech Adoption vs Profit
    try:
        fig6 = px.box(filtered, x='Tech Adoption', y='Profit', color='Tech Adoption',
                      title='Tech Adoption vs Profit')
    except Exception:
        fig6 = create_empty_figure("Tech Adoption vs Profit")
    figures['tech_vs_profit'] = fig6

    # 7. Growth Rate by Business Type
    try:
        growth_by_type = df.groupby('Business Type')['Growth Rate'].mean().reset_index()
        fig7 = px.bar(growth_by_type, x='Business Type', y='Growth Rate',
                      title='Average Growth Rate by Business Type')
    except Exception:
        fig7 = create_empty_figure("Growth by Business Type")
    figures['growth_by_type'] = fig7

    # 8. Revenue vs Customer Rating
    try:
        fig8 = px.scatter(filtered, x='Customer Rating', y='Revenue', title='Revenue vs Customer Rating',
                          trendline='ols', color='Season')
    except Exception:
        fig8 = create_empty_figure("Revenue vs Rating")
    figures['revenue_vs_rating'] = fig8

    overall_summary = (
        f"{summary['Peak Month']} and {summary['Best Season']} are peak periods. "
        f"Sentiment: {avg_sentiment}/5. Rating: {avg_rating}/5. "
        f"Revenue: ₹{summary['Total Revenue']:,}. Margin: {summary['Profit Margin']}%."
    )

    insights = {
        "revenue_interpretation": descriptions.get('monthly_revenue', 'No data'),
        "sentiment_interpretation": descriptions.get('sentiment_distribution', 'No data'),
        "seasonal_interpretation": descriptions.get('seasonal_revenue', 'No data'),
        "rating_interpretation": descriptions.get('rating_distribution', 'No data'),
        "business_insights": overall_summary
    }

    return {"summary": summary, **insights}, figures

def ask_question(question, graph_insights):
    if not sentence_model or DATASET_EMBEDDINGS is None:
        return "⚠️ Embeddings or model not initialized."

    insight_texts = list(graph_insights.values())
    if insight_texts:
        insight_embeddings = sentence_model.encode(insight_texts, convert_to_numpy=True)
        q_embedding = sentence_model.encode([question], convert_to_numpy=True)
        sim_scores = cosine_similarity(q_embedding, insight_embeddings)[0]
        best_idx = np.argmax(sim_scores)
        if sim_scores[best_idx] > 0.7:
            return f"📊 {insight_texts[best_idx]}"

    q_embedding = sentence_model.encode([question], convert_to_numpy=True)
    sim_scores = cosine_similarity(q_embedding, DATASET_EMBEDDINGS)[0]
    best_idx = np.argmax(sim_scores)
    if sim_scores[best_idx] > 0.65:
        return f"🔍 {DATASET_ROWS[best_idx]}"

    serpapi_api_key = API_CONFIG['serpapi']['key']
    if not serpapi_api_key:
        return "⚠️ SERPAPI_API_KEY not set."
    return enhanced_search(question, serpapi_api_key)

def enhanced_search(question, api_key, engine="google", max_retries=3):
    url = "https://serpapi.com/search"
    params = {
        "q": question,
        "api_key": api_key,
        "engine": engine,
        "num": 3
    }

    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            search_results = response.json()

            if search_results.get("organic_results"):
                return "\n".join(
                    [f"🌐 <a href=\"{r['link']}\" target=\"_blank\">{r['title']}</a>" for r in search_results["organic_results"]]
                )
            return "🌐 No relevant results found."
        except requests.exceptions.RequestException as e:
            sleep(2 ** attempt)
            if attempt == max_retries - 1:
                return f"⚠️ Search error: {str(e)}"
        except Exception as e:
            return f"⚠️ Error processing search results: {str(e)}"
