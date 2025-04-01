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

from ..serializers import TradeRequestSerializer
#This is a serializer that will be used to validate the incoming data for the buy and sell requests
#It will check if the data is in the correct format and return errors if not

from ..serializers import TradeSerializer
#Thi is a serializer that will be used to serialize the trade data for the response
#It will convert the trade data into JSON format for the response

from ..models import Trade
#This is a model that will be used to store the trade data in the database

from django.contrib.auth.models import User #TEST - imports the User model for testing purposes (will be removed later)

#This class handles the request to get all available trading pairs from the Coinbase API
class getCoinPairsView(APIView):
    def get(self,request):
        try:
            url = "https://api.exchange.coinbase.com/products"
            response = requests.get(url)
            response.raise_for_status()
            #Makes a GET request and response is in JSON format
            return Response(response.json())
        except requests.RequestException as e:
            #Accounts for any errors that may occur during the request
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#This class handles the request to get the price of a specific trading pair from the Coinbase API
class getCoinPriceView(APIView):
    def get(self,request,coin,quote_currency):
        try:
            url = f"https://api.exchange.coinbase.com/products/{coin}-{quote_currency}/ticker"
            response = requests.get(url)
            response.raise_for_status()
            #Makes a GET request and response is in JSON format
            #Returns the price
            return Response({"price": response.json()["price"]})
        except requests.RequestException as e:
            #Accounts for any errors that may occur during the request
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#This class handles the request to buy a specific cryptocurrency
#Uses a POST request to send the data to the server
#The data is validated using the TradeRequestSerializer
class BuyCryptoView(APIView):
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

            price = float(response.json()["price"])
            #Checks if the price is valid otherwise returns an error
            
            test_user, _  = User.objects.get_or_create(username="testuser") # TEST - it gets or creates a test user for testing purposes of the deposit

            #Creates a trade object with data and added to similated database
            trade = Trade.objects.create(
                user=test_user,
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

            price = float(response.json()["price"])
            #Checks if the price is valid otherwise returns an error
            
            test_user, _  = User.objects.get_or_create(username="testuser") # TEST - it gets or creates a test user for testing purposes of the deposit

            #Creates a trade object with data and added to similated database
            trade = Trade.objects.create(
                user=test_user,
                currency=coin,
                amount=amount,
                price_at_trade=price,
                trade_type="SELL"
            )

            #Confirmation message
            trade_data = TradeSerializer(trade).data
            return Response({"message": "Sell order placed", "trade" : trade_data}, status=201)
        return Response(serializer.errors, status=400)
    
#This class handles the request to get the trade history
#Uses a GET request to send the data to the server
class TradeHistoryView(APIView):
    def get(self, request):
        test_user, _  = User.objects.get_or_create(username="testuser")
        trades = Trade.objects.filter(user=test_user).order_by('-timestamp')

        serializer = TradeSerializer(trades, many=True)
        #Serializes the data using the TradeSerializer
        
        return Response({"trade_history": serializer.data})