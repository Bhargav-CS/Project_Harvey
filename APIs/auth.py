import requests
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE
from fastapi.responses import RedirectResponse

auth_router = APIRouter()

# In-memory dictionary to track used authorization codes
used_codes = {}

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

@auth_router.get("/auth/google-login-url")
async def get_google_login_url():
    """Generates the Google OAuth login URL"""
    auth_url = (
        f"https://{AUTH0_DOMAIN}/authorize"
        f"?response_type=code"
        f"&client_id={AUTH0_CLIENT_ID}"
        f"&redirect_uri=http://localhost:3000/auth/callback"
        f"&scope=openid%20profile%20email"
        f"&connection=google-oauth2"
    )
    return {"login_url": auth_url}

@auth_router.get("/auth/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="Authorization code missing")

    # Check if the code has already been used
    if code in used_codes:
        raise HTTPException(status_code=403, detail="Authorization code already used")

    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "code": code,
        "redirect_uri": f"http://localhost:3000/auth/callback"  # Ensure this matches your frontend
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(token_url, json=payload, headers=headers)
        response.raise_for_status()
        token_data = response.json()

        # Mark the code as used
        used_codes[code] = True

        return token_data  # Send this token back to the frontend
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=response.json())


