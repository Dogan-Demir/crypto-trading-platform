from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests
from decimal import Decimal
from django.contrib.auth.models import User
from auth_app.models import UserProfile, Transaction, Portfolio, Cryptocurrency

app = FastAPI()

COINS_PRODUCTS_API = "https://api.exchange.coinbase.com/products";

trades = [] # list to store trades (Replace with database later)

#Trade request for the data model
class TradeRequest(BaseModel):
    cryptocurrency_id: int
    amount: float
    trade_type: str  # 'BUY' or 'SELL'

@app.post("/trade")
async def execute_trade(trade: TradeRequest, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        crypto = Cryptocurrency.objects.get(id=trade.cryptocurrency_id)
        profile = user.userprofile
        
        total_cost = Decimal(str(trade.amount)) * crypto.current_price

        if trade.trade_type == 'BUY':
            # Check if user has enough balance
            if profile.balance < total_cost:
                raise HTTPException(status_code=400, detail="Insufficient funds")
            
            # Update user's balance
            profile.balance -= total_cost
            profile.save()

            # Update or create portfolio entry
            portfolio, created = Portfolio.objects.get_or_create(
                user=user,
                cryptocurrency=crypto,
                defaults={'amount': 0}
            )
            portfolio.amount += Decimal(str(trade.amount))
            portfolio.save()

        elif trade.trade_type == 'SELL':
            # Check if user has enough crypto
            portfolio = Portfolio.objects.filter(
                user=user,
                cryptocurrency=crypto
            ).first()

            if not portfolio or portfolio.amount < Decimal(str(trade.amount)):
                raise HTTPException(status_code=400, detail="Insufficient cryptocurrency balance")

            # Update user's balance
            profile.balance += total_cost
            profile.save()

            # Update portfolio
            portfolio.amount -= Decimal(str(trade.amount))
            portfolio.save()

        # Record the transaction
        Transaction.objects.create(
            user=user,
            cryptocurrency=crypto,
            transaction_type=trade.trade_type,
            amount=trade.amount,
            price_at_transaction=crypto.current_price
        )

        return {
            "status": "success",
            "message": f"{trade.trade_type} order executed successfully",
            "amount": trade.amount,
            "total_cost": float(total_cost),
            "new_balance": float(profile.balance)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/trade/history")
def get_trade_history():
    return {"trade history": trades}
    
