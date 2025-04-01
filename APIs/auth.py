import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE
from fastapi.responses import RedirectResponse

auth_router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str  # Additional field for user name

@auth_router.post("/login")
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

@auth_router.post("/signup")
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

@auth_router.get("/auth/callback")
async def auth_callback(code: str, state: str = None):
    """
    Handles the callback from Auth0 after Google login.
    Exchanges the authorization code for tokens and returns the access token.
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
        tokens = response.json()  # Contains access_token, id_token, etc.
        return {"access_token": tokens.get("access_token"), "id_token": tokens.get("id_token")}
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=response.json())

@auth_router.get("/auth/google-login-url")
async def get_google_login_url():
    """
    Redirects the user to the Auth0 Google login page.
    """
    try:
        google_login_url = (
            f"https://{AUTH0_DOMAIN}/authorize"
            f"?response_type=code"
            f"&client_id={AUTH0_CLIENT_ID}"
            f"&redirect_uri=http://localhost:3000/auth/callback"  # Match frontend
            f"&scope=openid%20profile%20email"
            f"&connection=google-oauth2"
        )
        return RedirectResponse(url=google_login_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate Google login URL")
