import requests

url = "https://api.indiankanoon.org/search/"
headers = {
    "Authorization": "Token 18f8bf38ef2962a7d59176c69869a07cc1604cb9",
    "Accept": "application/json"
}
data = {"formInput": "freedom of speech"}

response = requests.post(url, headers=headers, json=data)

print(response.status_code)
print(response.json())


# <form method="POST" action="/doc/591481/">
#         <input type="hidden" name="type" value="pdf">
#         <button id="pdfdoc" type="submit" class="ui-button ui-corner-all ui-widget"><span class="ui-button-icon ui-icon ui-icon-document"></span><span class="ui-button-icon-space"> </span>Get this document in PDF</button>
#     </form>
    