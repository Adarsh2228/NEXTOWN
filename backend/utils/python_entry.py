# backend/utils/python_entry.py
import sys
import json
from business_analysis_core import analyze_business_data

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing business type"}))
        sys.exit(1)

    business_type = sys.argv[1]
    result, error = analyze_business_data(business_type)

    if error:
        print(json.dumps({"error": error}))
        sys.exit(1)

    print(json.dumps(result))
