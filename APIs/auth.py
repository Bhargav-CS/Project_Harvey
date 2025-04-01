import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE  # Use relative import

app = FastAPI()

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str  # Additional field for user name

@app.post("/login")  # Remove "/auth" prefix since it's mounted in server.py
async def login_user(request: LoginRequest):
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    payload = {
        "grant_type": "password",
        "username": request.email,
        "password": request.password,
        "audience": AUTH0_AUDIENCE,
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()  # Returns the token and other details
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=response.json())

@app.post("/signup")  # Remove "/auth" prefix since it's mounted in server.py
async def signup_user(request: SignupRequest):
    url = f"https://{AUTH0_DOMAIN}/dbconnections/signup"
    payload = {
        "client_id": AUTH0_CLIENT_ID,
        "email": request.email,
        "password": request.password,
        "connection": "Username-Password-Authentication",
        "name": request.name,
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return {"message": "User successfully registered"}
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=response.json())
