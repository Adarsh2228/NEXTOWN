from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the MongoDB URL
mongo_url = os.getenv('MONGO_URL')

# Check if the required variables are loaded
if mongo_url is None:
    raise ValueError("MONGO_URL environment variable not set in .env file")

# You can add other configuration variables here as needed