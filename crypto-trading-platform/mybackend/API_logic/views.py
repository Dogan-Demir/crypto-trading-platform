from .utils import get_balance, update_balance, has_sufficient_balance
#This file contains the views for the API endpoints of the crypto trading platform.

from decimal import Decimal, getcontext
#Imports the Decimal class from the decimal module for precise decimal arithmetic
getcontext().prec = 18
#Sets the precision for decimal operations to 18 decimal places

from django.conf import settings
#Imports the settings from the Django project

import requests
#Python HTTP library for making requests to APIs

from rest_framework.views import APIView
#Django REST framework view for handling API requests

from rest_framework.response import Response
#Instead of returning raw HTTPResponse this gives a clean way to return JSON with status codes

from rest_framework import status
#Uses readable constants for HTTP status codes
#200 represents ok
#400 represents bad request
#500 represents internal server error
#201 represents created

from .serializers import TradeRequestSerializer, TradeSerializer, DepositSerializer, WithdrawalSerializer, MockBalanceSerializer
#Imports the serializers for the trade, deposit and withdrawal models
#Serializers are used to convert complex data types, like querysets and model instances, into native Python datatypes that can then be easily rendered into JSON or XML.

from .models import Trade, Deposit, Withdrawal, MockBalance
#This is a models that will be used to store the trade (buy and sell), deposit and withdrawl data in the database

from django.contrib.auth.models import User #TEST - imports the User model for testing purposes (will be removed later)

from rest_framework.permissions import IsAuthenticated
#Imports the IsAuthenticated permission class to restrict access to authenticated users

#This class handles the request to get all available trading pairs from the Coinbase API
class getCoinPairsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            url = "https://api.exchange.coinbase.com/products"
            headers = {
                'CB-ACCESS-KEY': settings.COINBASE_API_KEY_ID,
                'Content-Type': 'application/json'
            }
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            products = response.json()
            #Checks if the response is valid otherwise returns an error

            usd_pairs = [item['id'] for item in products if item['quote_currency'] == 'USD']
            result = []
            #Iterates through the products and checks if the quote currency is USD

            for pair in usd_pairs[:10]: #Limit to first 10 pairs for performance
                price_url = f"https://api.exchange.coinbase.com/products/{pair}/ticker"
                try:
                    price_response = requests.get(price_url, headers=headers)
                    price_response.raise_for_status()
                    price = price_response.json().get("price", "N/A")
                    #Checks if the response is valid otherwise returns an error
                except:
                    price = "Unavailable"
                #If the price is not available it sets it to unavailable

                result.append({
                    "pair": pair,
                    "price": price
                })

            return Response({"pairs": result})
            #Returns the list of trading pairs and their prices in JSON format
                                
        except requests.RequestException as e:
            #Accounts for any errors that may occur during the request
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#This class handles the request to get the price of a specific trading pair from the Coinbase API
class getCoinPriceView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,coin,quote_currency):
        try:
            url = f"https://api.exchange.coinbase.com/products/{coin}-{quote_currency}/ticker"
            headers = {
                'CB-ACCESS-KEY': settings.COINBASE_API_KEY_ID,
                'Content-Type': 'application/json'
            }
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            #Makes a GET request and response is in JSON format
            #Returns the price
            
            return Response({
                "coin": coin,
                "quote_currency": quote_currency,
                "price": data.get("price"),
                "raw": data
            })
            
        except requests.RequestException as e:
            #Accounts for any errors that may occur during the request
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#This class handles the request to buy a specific cryptocurrency
#Uses a POST request to send the data to the server
#The data is validated using the TradeRequestSerializer
class BuyCryptoView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = TradeRequestSerializer(data = request.data)
        if serializer.is_valid():
            #Using a custom serializer to validate the incoming data
            coin = serializer.validated_data['currency']
            amount = serializer.validated_data['amount']
            #Once data is validated it is extracted
            url = f"https://api.exchange.coinbase.com/products/{coin}-USD/ticker"
            response = requests.get(url)
            #Checks if the response is valid otherwise returns an error
            if response.status_code != 200:
                return Response({"error": "Failed to fetch price"}, status=400)

            price = Decimal(response.json()["price"])
            #Checks if the price is valid otherwise returns an error
            
            cost = price * amount # calculates the cost of the trade

            user = request.user

            if not has_sufficient_balance(user, "USD", cost):
                return Response({"error": "Insufficient balance"}, status=400)

            try:
                update_balance(user, "USD", -cost) # updates the balance of the user by subtracting the cost of the trade
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
            
            update_balance(user, coin, amount) # updates the balance of the user by adding the amount of the trade
            
            #Creates a trade object with data and added to similated database
            trade = Trade.objects.create(
                user=user,
                currency=coin,
                amount=amount,
                price_at_trade=price,
                trade_type="BUY"
            )

            #Confirmation message
            trade_data = TradeSerializer(trade).data
            return Response({"message": "Buy order placed", "trade" : trade_data}, status=201)
        
        return Response(serializer.errors, status=400)

#This class handles the request to sell a specific cryptocurrency
#Uses a POST request to send the data to the server
#The data is validated using the TradeRequestSerializer
class SellCryptoView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = TradeRequestSerializer(data = request.data)
        if serializer.is_valid():
            #Using a custom serializer to validate the incoming data
            coin = serializer.validated_data['currency']
            amount = serializer.validated_data['amount']

            #Once data is validated it is extracted
            url = f"https://api.exchange.coinbase.com/products/{coin}-USD/ticker"
            response = requests.get(url)
            #Checks if the response is valid otherwise returns an error
            if response.status_code != 200:
                return Response({"error": "Failed to fetch price"}, status=400)

            price = Decimal(response.json()["price"])
            #Checks if the price is valid otherwise returns an error

            revenue = price * amount # calculates the revenue of the trade
            
            user = request.user

            if not has_sufficient_balance(user, coin, amount):
                return Response({"error": "Insufficient balance"}, status=400)

            try:
                update_balance(user, coin, -amount) # updates the balance of the user by subtracting the amount of the trade
                update_balance(user, "USD", revenue) # updates the balance of the user by adding the revenue of the trade
            except ValueError as e:
                return Response({"error": str(e)}, status=400)

            #Creates a trade object with data and added to similated database
            trade = Trade.objects.create(
                user=user,
                currency=coin,
                amount=amount,
                price_at_trade=price,
                trade_type="SELL"
            )

            #Confirmation message
            trade_data = TradeSerializer(trade).data
            return Response({"message": "Sell order placed", "trade" : trade_data}, status=201)
        return Response(serializer.errors, status=400)
    

# this class handles the deposit requests
class DepositView(APIView):
    permission_classes = [IsAuthenticated] 
    # it uses a POST request to handle the deposit and validates it using the DepositSerializer
    def post(self, request):
        serializer = DepositSerializer(data=request.data) # creates serializer instance with the data from the request (whcih is amount and currency)

        if serializer.is_valid(): 

            user = request.user


            serializer.save(user=user, status="completed")  # if data is valid, it saves the deposit and changs status to completed
            
            #Update balance
            currency = serializer.validated_data['currency'] # gets the currency from the validated data
            amount = serializer.validated_data['amount'] # gets the amount from the validated data
            
            try:
                update_balance(user, currency, amount) # updates the balance of the user by adding the amount of the deposit
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
            
            # it returns message to say successful and the deposit data
            return Response({"message": "Deposit successful", "data": serializer.data}, status=status.HTTP_201_CREATED) # http status code 201 shows its successfully created
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # but if data is invalid, it returns errors and a http 400
    
# This class handles withdrawal requests
class WithdrawalView(APIView): 
    permission_classes = [IsAuthenticated]
    # all very similar to the deposit view just now for withdrawals
    def post(self, request):
        serializer = WithdrawalSerializer(data=request.data)

        if serializer.is_valid():
            
            user = request.user


            #Update balance
            currency = serializer.validated_data['currency'] # gets the currency from the validated data
            amount = serializer.validated_data['amount'] # gets the amount from the validated data
            
            if not has_sufficient_balance(user, currency, amount):
                return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save(user=user, status="completed")
            
            try:
                update_balance(user, currency, -amount) # updates the balance of the user by adding the amount of the withdrawl  
            except ValueError as e:
                return Response({"error": str(e)}, status=400)

            return Response({"message": "Withdrawal successful", "data": serializer.data}, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 
class AllTransactionsView(APIView): #view returns all deposits and withdrawals in the db table
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({ 
            "deposits": DepositSerializer(Deposit.objects.all(), many=True).data, # gets records of all deposits, serializes them and returns them in JSON format
            "withdrawals": WithdrawalSerializer(Withdrawal.objects.all(), many=True).data, #does the same for withdrawals
            "trades" : TradeSerializer(Trade.objects.all(), many=True).data #does the same for trades
        })


#This class handles the request to get the trade history
#Uses a GET request to send the data to the server
class TradeHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        trades = Trade.objects.filter(user=user).order_by('-timestamp')

        serializer = TradeSerializer(trades, many=True)
        #Serializes the data using the TradeSerializer
        
        return Response({"trade_history": serializer.data})
    

#This class handles the request to get the balance of a specific cryptocurrency
class GetBalanceView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        balances = MockBalance.objects.filter(user=user)
        #Gets the balance of the test user from the database
        serializer = MockBalanceSerializer(balances, many=True)
        #Serializes the data using the MockBalanceSerializer
        return Response({"balances": serializer.data})

#This class handles the request to set the starting balance for a specific cryptocurrency   
class StartBalanceView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user

        currency = request.data.get("currency")
        amount = request.data.get("amount")

        #Checks if the currency and amount are provided in the request data
        if not currency or not amount:
            return Response({"error": "Currency and amount are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        #Checks if the currency is valid (only USD, BTC, ETH, LTC are allowed)
        #If it doesn't exist it creates a new one
        balance_obj, created = MockBalance.objects.get_or_create(user=user, currency=currency.upper(), defaults={"balance":Decimal(amount)})
        
        if not created:
            balance_obj.balance = Decimal(amount)
            balance_obj.save()

        return Response({"message": f"{currency} balance set to {amount}."})
    

