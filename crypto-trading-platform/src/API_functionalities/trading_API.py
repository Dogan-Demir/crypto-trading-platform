from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests

app = FastAPI()

COINS_PRODUCTS_API = "https://api.exchange.coinbase.com/products";

trades = [] # list to store trades (Replace with database later)

#Trade request for the data model
class TradeRequest(BaseModel):
    quote_currency: str
    amount: float
#Ensures the API has valid data
#If a invalid request is sent then API rejects it

@app.post("/trade/buy")
def buy_crypto(trade: TradeRequest):
    response = requests.get(f"{COINS_PRODUCTS_API}/{trade.cryptocurrency}-USD/ticker")
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch price")
    
    price_at_trade = float(response.json()["price"])

    trade_data = {
        "trade_type":"BUY",
        "crypotcurrency": trade.cryptocurrency,
        "amount": trade.amount,
        "price_at_trade": price_at_trade,
    }
    trades.append(trade_data)
    return{"message":"Buy order placed","trade":trade_data}

@app.post("/trade/sell")
def sell_crypto(trade: TradeRequest):
    response = requests.get(f"{COINS_PRODUCTS_API}/{trade.cryptocurrency}-USD/ticker")
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch price")
    
    price_at_trade = float(response.json()["price"])

    trade_data = {
        "trade_type":"SELL",
        "crypotcurrency": trade.cryptocurrency,
        "amount": trade.amount,
        "price_at_trade": price_at_trade,
    }
    trades.append(trade_data)
    return{"message":"Sell order placed","trade":trade_data}

@app.get("/trade/history")
def get_trade_history():
    return {"trade history": trades}
    
