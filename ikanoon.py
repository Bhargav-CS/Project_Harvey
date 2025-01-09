import json
import requests

with open("kanoon_api_key.txt") as f:
    API_TOKEN = f.read().strip()
 

# Replace with your actual token
BASE_URL = "https://api.indiankanoon.org"
HEADERS = {"Authorization": f"Token {API_TOKEN}"}


def search_query(query, page_num=0, doc_type=None, from_date=None, to_date=None):
    endpoint = f"{BASE_URL}/search/"
    params = {"formInput": query, "pagenum": page_num}
    
    if doc_type:
        params["doctypes"] = doc_type
    if from_date:
        params["fromdate"] = from_date
    if to_date:
        params["todate"] = to_date

    response = requests.post(endpoint, headers=HEADERS, params=params)
    return response.json() if response.status_code == 200 else response.text


results = search_query("freedom of speech", page_num=0, doc_type="supremecourt")
print(results)

#save the results in a file

with open("ikanoon_results.json", "w") as f:
    json.dump(results, f)
    
    
