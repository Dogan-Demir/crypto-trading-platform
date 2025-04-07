from rest_framework import generics, permissions
from .serializers import SignupSerializer, TransactionSerializer, PortfolioSerializer, CryptocurrencySerializer, LoginSerializer, DepositSerializer
from .models import Transaction, Portfolio, Cryptocurrency, Deposit
import uuid
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django_otp.plugins.otp_totp.models import TOTPDevice
import qrcode
from io import BytesIO
import base64
from .utils import send_email_verification, send_sms_verification

from rest_framework import generics
from .serializers import SignupSerializer

from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, authenticate
from rest_framework.authtoken.models import Token

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

