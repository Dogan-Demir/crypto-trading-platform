from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, Transaction, Portfolio, Cryptocurrency, Deposit, Withdrawal, Trade, MockBalance
from django.contrib.auth import authenticate
from decimal import Decimal, getcontext
getcontext().prec = 18 # set the precision for decimal operations to 18


# Custom password validation
def validate_password(value):
    if len(value) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    if not any(char.isdigit() for char in value):
        raise ValidationError("Password must contain at least one digit.")
    if not any(char.isalpha() for char in value):
        raise ValidationError("Password must contain at least one letter.")
    if not any(char in "?!@#$%^&*()-_=+" for char in value):
        raise ValidationError("Password must contain at least one special character.")
    return value

# Handles user registration
class SignupSerializer(serializers.ModelSerializer):
    # Password fields are write-only for security
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    enable_2fa = serializers.BooleanField(required=False, default=False)
    two_factor_method = serializers.ChoiceField(
        choices=[
            ('EMAIL', 'Email'),
            ('SMS', 'SMS'),
            ('TOTP', 'Authenticator App')
        ],
        required=False,
        allow_null=True
    )
    phone_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'enable_2fa', 'two_factor_method', 'phone_number')

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        
        # Check for duplicate email
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        # Validate 2FA settings
        if data.get('enable_2fa'):
            if not data.get('two_factor_method'):
                raise serializers.ValidationError("Two-factor method is required when 2FA is enabled.")
            
            # Validate phone number for SMS
            if data.get('two_factor_method') == 'SMS':
                phone_number = data.get('phone_number')
                if not phone_number:
                    raise serializers.ValidationError("Phone number is required for SMS verification.")
                if not phone_number.startswith('+'):
                    raise serializers.ValidationError("Phone number must start with '+' followed by the country code.")
        
        return data

    def create(self, validated_data):
        # Remove password confirmation and 2FA fields
        password2 = validated_data.pop('password2')
        enable_2fa = validated_data.pop('enable_2fa', False)
        two_factor_method = validated_data.pop('two_factor_method', None)
        phone_number = validated_data.pop('phone_number', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create user profile with 2FA settings
        UserProfile.objects.create(
            user=user,
            two_factor_enabled=enable_2fa,
            two_factor_method=two_factor_method,
            phone_number=phone_number
        )
        
        return user

# Handles transaction data
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        # These fields are set automatically
        read_only_fields = ('user', 'timestamp', 'price_at_transaction')

# Handles portfolio data
class PortfolioSerializer(serializers.ModelSerializer):
    # Add cryptocurrency symbol to the output
    cryptocurrency_symbol = serializers.CharField(
        source='cryptocurrency.symbol', 
        read_only=True
    )
    
    class Meta:
        model = Portfolio
        fields = ('cryptocurrency_symbol', 'amount', 'last_modified')
        read_only_fields = ('last_modified',)

# Handles cryptocurrency data
class CryptocurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Cryptocurrency
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not (username or email):
            raise serializers.ValidationError('Must provide either username or email.')
        if not password:
            raise serializers.ValidationError('Must provide password.')

        # Try to authenticate with username or email
        if username:
            user = authenticate(username=username, password=password)
        else:
            try:
                user = User.objects.get(email=email)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                user = None

        if user:
            if user.is_active:
                data['user'] = user
            else:
                raise serializers.ValidationError('User account is disabled.')
        else:
            raise serializers.ValidationError('Invalid credentials.')
        
        return data

class UserBalanceSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(max_digits=15, decimal_places=2, source='userprofile.balance')
    
    class Meta:
        model = User
        fields = ['username', 'balance']

class TradeRequestSerializer(serializers.Serializer):
    currency = serializers.CharField()
    amount = serializers.DecimalField(max_digits=20, decimal_places=8)

class DepositSerializer(serializers.ModelSerializer): # the serializer for the deposit model
    amount = serializers.DecimalField(max_digits=20, decimal_places=8) 

    class Meta: # inner class to give metadata about the serializer
        model = Deposit # based on deposit model
        fields = ['amount', 'currency'] #only these fields will be serialized 

class WithdrawalSerializer(serializers.ModelSerializer): # serializer for the withdrawal model
    class Meta:
        model = Withdrawal # based on withdrawal model
        fields = ['amount', 'currency', 'destination_address']

class TradeSerializer(serializers.ModelSerializer): # serializer for the trade model
    class Meta:
        model = Trade
        fields = '__all__'


class MockBalanceSerializer(serializers.ModelSerializer): # serializer for the mock balance model
    class Meta:
        model = MockBalance # based on mock balance model
        fields = '__all__' # only these fields will be serialized