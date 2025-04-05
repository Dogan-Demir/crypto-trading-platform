from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, Transaction, Portfolio, Cryptocurrency, Deposit
from django.contrib.auth import authenticate

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
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        
        # Check for duplicate email
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return data

    def create(self, validated_data):
        # Remove password confirmation field
        validated_data.pop('password2')
        # Create user and associated profile
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
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
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Invalid username or password.')
        else:
            raise serializers.ValidationError('Must provide username and password.')
        
        return data

class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = ['amount']

class UserBalanceSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(max_digits=15, decimal_places=2, source='userprofile.balance')
    
    class Meta:
        model = User
        fields = ['username', 'balance']
