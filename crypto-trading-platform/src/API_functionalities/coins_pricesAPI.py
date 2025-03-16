from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests

app = FastAPI()

COINS_PRODUCTS_API = "https://api.exchange.coinbase.com/products";

@app.get("/pairs") # can be used later when getting all available trading pairs
def get_coin_pairs():
    try:
        coins_data_response = requests.get(COINS_PRODUCTS_API) # it sends a GET request to the API
        coins_data_response.raise_for_status() # Raises an exception if the status code is not 200
        return coins_data_response.json()
    except Exception as error: # Catches any exceptions, only possible one should be 500 for this endpoint
        return JSONResponse(status_code=coins_data_response.status_code, content={"error": str(error)})
        

@app.get("/price/{coin}/{quote_currency}") # Gets the price of a specific trading pair
def get_coin_price(coin: str, quote_currency: str):
    try:
        coins_data_response = requests.get(f"{COINS_PRODUCTS_API}/{coin}-{quote_currency}/ticker")  # sends GET request including specific coin and currency pair to the API
        coins_data_response.raise_for_status() 
        return coins_data_response.json()["price"] # it only returns the price of the coin in the currecy requested
    except Exception as error:
        return JSONResponse(status_code=coins_data_response.status_code, content={"error": str(error)})