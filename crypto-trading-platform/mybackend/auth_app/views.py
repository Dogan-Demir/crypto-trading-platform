import requests
from rest_framework import generics, permissions
from .serializers import SignupSerializer, TransactionSerializer, PortfolioSerializer, CryptocurrencySerializer, LoginSerializer,TradeRequestSerializer, TradeSerializer, DepositSerializer, WithdrawalSerializer, MockBalanceSerializer
from .models import Transaction, Portfolio, Cryptocurrency, Trade, Deposit, Withdrawal, MockBalance
import uuid
from decimal import Decimal, getcontext
#Imports the Decimal class from the decimal module for precise decimal arithmetic
getcontext().prec = 18

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django_otp.plugins.otp_totp.models import TOTPDevice
import qrcode
from io import BytesIO
import base64
from .utils import send_email_verification, send_sms_verification

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import SignupSerializer

from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, authenticate
from rest_framework.authtoken.models import Token
from django.conf import settings

from .utils_trade import get_MockBalance, update_balance, has_sufficient_balance
#This file contains the views for the API endpoints of the crypto trading platform.

# Handles user registration
class SignUpView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print("Signup request data:", request.data)  # Debug log
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Validation error:", str(e))  # Debug log
            raise
        
        user = serializer.save()
        
        # Create token for the new user
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user profile to check 2FA settings
        user_profile = user.userprofile
        
        response_data = {
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'requires_2fa_setup': user_profile.two_factor_enabled
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

# Handles listing and creating transactions
class TransactionListView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    # Only authenticated users can access
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return transactions for the current user
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user when creating a transaction
        serializer.save(user=self.request.user)

# Shows user's portfolio
class PortfolioView(generics.ListAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return portfolio entries for the current user
        return Portfolio.objects.filter(user=self.request.user)

# Lists available cryptocurrencies
class CryptocurrencyListView(generics.ListAPIView):
    serializer_class = CryptocurrencySerializer
    queryset = Cryptocurrency.objects.all()

from django.http import HttpResponse

def index(request):

    return HttpResponse("Welcome to the crypto trading platform!")

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("Login request data:", request.data)  # Debug log
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Validation error:", str(e))  # Debug log
            raise
        
        user = serializer.validated_data['user']
        login(request, user)
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_balance(request):
    return Response({
        'balance': request.user.userprofile.balance
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_2fa_method(request):
    user_profile = request.user.userprofile
    
    if user_profile.two_factor_method == 'TOTP':
        # Create TOTP device for the user
        device = TOTPDevice.objects.create(
            user=request.user,
            name='default',
            confirmed=True
        )
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(device.config_url)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        qr_code = base64.b64encode(buffered.getvalue()).decode()
        
        return Response({
            'method': 'TOTP',
            'qr_code': f"data:image/png;base64,{qr_code}"
        })
    elif user_profile.two_factor_method == 'EMAIL':
        try:
            send_email_verification(request.user)
            return Response({
                'method': 'EMAIL',
                'message': 'Verification code sent to your email.'
            })
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return Response({
                'method': 'EMAIL',
                'message': 'Error sending verification code. Please try again.'
            }, status=500)
    elif user_profile.two_factor_method == 'SMS':
        try:
            send_sms_verification(request.user)
            return Response({
                'method': 'SMS',
                'message': 'Verification code sent to your phone.'
            })
        except Exception as e:
            print(f"Error sending SMS: {str(e)}")
            return Response({
                'method': 'SMS',
                'message': 'Error sending verification code. Please try again.'
            }, status=500)
    else:
        return Response({
            'error': 'Invalid 2FA method'
        }, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_2fa_token(request):
    token = request.data.get('token')
    if not token:
        return Response({'detail': 'Token is required'}, status=400)
    
    user_profile = request.user.userprofile
    
    if user_profile.two_factor_method == 'TOTP':
        device = TOTPDevice.objects.get(user=request.user, name='default')
        if device.verify_token(token):
            return Response({'detail': '2FA setup completed successfully'})
        else:
            return Response({'detail': 'Invalid token'}, status=400)
    elif user_profile.two_factor_method == 'EMAIL':
        if user_profile.email_verification_code == token:
            user_profile.email_verification_code = None
            user_profile.save()
            return Response({'detail': '2FA setup completed successfully'})
        else:
            return Response({'detail': 'Invalid token'}, status=400)
    elif user_profile.two_factor_method == 'SMS':
        if user_profile.sms_verification_code == token:
            user_profile.sms_verification_code = None
            user_profile.save()
            return Response({'detail': '2FA setup completed successfully'})
        else:
            return Response({'detail': 'Invalid token'}, status=400)
    
    return Response({'detail': 'Invalid 2FA method'}, status=400)


#This class handles the request to get the list of trading pairs from the Coinbase API
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
    


