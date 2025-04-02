from rest_framework import generics, permissions
from .serializers import SignupSerializer, TransactionSerializer, PortfolioSerializer, CryptocurrencySerializer, LoginSerializer, DepositSerializer
from .models import Transaction, Portfolio, Cryptocurrency, Deposit
import uuid
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# views function takes a request and returns a response / requesst handler / action

from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, authenticate
from rest_framework.authtoken.models import Token

# Handles user registration
class SignUpView(generics.CreateAPIView):
    serializer_class = SignupSerializer

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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
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

class DepositView(generics.CreateAPIView):
    serializer_class = DepositSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Generate a unique reference for the deposit
        reference = str(uuid.uuid4())
        
        # Create the deposit record
        deposit = Deposit.objects.create(
            user=self.request.user,
            amount=serializer.validated_data['amount'],
            reference=reference,
            status='COMPLETED'  # In a real app, this would be 'PENDING' until payment confirmation
        )

        # Update user's balance
        profile = self.request.user.userprofile
        profile.balance += deposit.amount
        profile.save()

        return deposit

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        deposit = self.perform_create(serializer)
        
        return Response({
            'message': 'Deposit successful',
            'amount': deposit.amount,
            'new_balance': self.request.user.userprofile.balance
        }, status=status.HTTP_201_CREATED)

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
