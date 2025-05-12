import requests
from fastapi import HTTPException

CLERK_API_URL = "https://api.clerk.dev/v1"
CLERK_API_KEY = "sk_test_nya4t8ICPO73GmkPVxU0LUqkHfU3UQj1HoVIeZwBqP"  # Reemplaza con tu API Key de Clerk

def verify_clerk_token(token: str):
    """
    Verifica el token JWT con Clerk y obtiene los datos del usuario.
    """
    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(f"{CLERK_API_URL}/users/me", headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    return response.json()  # Devuelve los datos del usuario
