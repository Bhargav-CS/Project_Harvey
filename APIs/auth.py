import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE  # Use relative import
from fastapi.responses import RedirectResponse

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


@app.get("/auth/callback")
async def auth_callback(code: str, state: str = None):
    """
    Handles the callback from Auth0 after Google login.
    Exchanges the authorization code for tokens and redirects to the home page.
    """
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "code": code,
        "redirect_uri": "http://localhost:8000/auth/callback",  # Must match the one used in Auth0
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        # Redirect to the home page after successful login
        return RedirectResponse(url="http://localhost:3000/home")  # Frontend home page URL
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=response.json())

@app.get("/auth/google-login-url")
async def get_google_login_url():
    """
    Redirects the user to the Auth0 Google login page.
    """
    google_login_url = (
        f"https://{AUTH0_DOMAIN}/authorize"
        f"?response_type=code"
        f"&client_id={AUTH0_CLIENT_ID}"
        f"&redirect_uri=http://localhost:8000/auth/callback"  # Replace <REDIRECT_URI> with your callback URL
        f"&scope=openid%20profile%20email"
        f"&connection=google-oauth2"
    )
    return RedirectResponse(url=google_login_url)
