# backend/utils/business_analysis_core.py
import pandas as pd
import numpy as np
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'indian_business_performance_data.csv')

def analyze_business_data(business_type):
    df = pd.read_csv(CSV_PATH)
    business_data = df[df['type'].str.lower() == business_type.lower()]

    if business_data.empty:
        return None, "No data found for this business type."

    summary = {
        "Total Revenue": business_data["revenue"].sum(),
        "Average Monthly Revenue": int(business_data["revenue"].mean()),
        "Peak Month": business_data.loc[business_data["revenue"].idxmax(), "month"],
        "Best Season": business_data["season"].mode().iloc[0],
        "Average Sentiment Score": round(business_data["sentiment_score"].mean(), 2),
        "Profit Margin": round(business_data["profit_margin"].mean(), 2),
    }

    insights = (
        f"The {business_type} business tends to perform best during {summary['Best Season']}, "
        f"especially in the month of {summary['Peak Month']}. With an average sentiment score of "
        f"{summary['Average Sentiment Score']} out of 5, customers generally perceive this business positively."
    )

    return {
        "summary": summary,
        "business_insights": insights
    }, None
