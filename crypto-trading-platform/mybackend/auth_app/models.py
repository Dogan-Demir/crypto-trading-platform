from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

# User Profile extends Django's built-in User model
class UserProfile(models.Model):
    # OneToOneField creates a one-to-one relationship with Django's User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Stores user's balance with 2 decimal places and max 15 digits
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    # Automatically sets when profile is created
    created_at = models.DateTimeField(auto_now_add=True)
    # 2FA settings
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_method = models.CharField(
        max_length=10,
        choices=[
            ('EMAIL', 'Email'),
            ('SMS', 'SMS'),
            ('TOTP', 'Authenticator App')
        ],
        null=True,
        blank=True
    )
    # Phone number for SMS verification
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    # Email verification code
    email_verification_code = models.CharField(max_length=6, null=True, blank=True)
    # SMS verification code
    sms_verification_code = models.CharField(max_length=6, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

# Stores information about different cryptocurrencies
class Cryptocurrency(models.Model):
    # Unique identifier for the cryptocurrency (e.g., 'BTC', 'ETH')
    symbol = models.CharField(max_length=10, unique=True)
    # Full name of the cryptocurrency (e.g., 'Bitcoin', 'Ethereum')
    name = models.CharField(max_length=50)
    # Current price of the cryptocurrency
    current_price = models.DecimalField(max_digits=15, decimal_places=2)
    # Updates automatically whenever the record is modified
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

# Records all buy/sell transactions
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    ]

    # Links transaction to a user
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Links transaction to a cryptocurrency
    cryptocurrency = models.ForeignKey(Cryptocurrency, on_delete=models.CASCADE)
    # Type of transaction (BUY or SELL)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPES)
    # Amount of cryptocurrency bought/sold
    amount = models.DecimalField(max_digits=15, decimal_places=8)
    # Price at the time of transaction
    price_at_transaction = models.DecimalField(max_digits=15, decimal_places=2)
    # When the transaction occurred
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} {self.amount} {self.cryptocurrency.symbol} by {self.user.username}"

# Tracks how much of each cryptocurrency a user owns
class Portfolio(models.Model):
    # Links portfolio entry to a user
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Links portfolio entry to a cryptocurrency
    cryptocurrency = models.ForeignKey(Cryptocurrency, on_delete=models.CASCADE)
    # Amount owned (must be non-negative)
    amount = models.DecimalField(
        max_digits=15, 
        decimal_places=8, 
        validators=[MinValueValidator(0)]
    )
    # Updates whenever the amount changes
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        # Ensures a user can't have multiple entries for the same cryptocurrency
        unique_together = ['user', 'cryptocurrency']

    def __str__(self):
        return f"{self.user.username}'s {self.cryptocurrency.symbol} holdings"

class Deposit(models.Model): # this is the database model for storing info on deposits
# columns in the db table
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_deposits') # foriegn key to user model
    amount = models.DecimalField(max_digits=20, decimal_places=8) # the amount whichll get deposited
    currency = models.CharField(max_length=10) #currency 
    timestamp = models.DateTimeField(auto_now_add=True) # it exact timestamp when it happens gets automatically added
    status = models.CharField(max_length=20, default="pending") # inititally shows status as pending by default until set to completeed

    def __str__(self): 
        return f"{self.user.username} deposited {self.amount} {self.currency}" # returns string of user and how much they deposited

class Withdrawal(models.Model): # withdrawal db model
    
    # similar columns to the deposits model
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    currency = models.CharField(max_length=10)
    destination_address = models.CharField(max_length=255) # this is the address to send the money to
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="pending")

    def __str__(self):
        return f"{self.user.username} withdrew {self.amount} {self.currency} to {self.destination_address}" # returns string of user, how much they withdrew and to where

class Trade(models.Model):
    TRADE_TYPES = (("BUY", "Buy"), ("SELL", "Sell")) # this is a tuple of the trade types

    user = models.ForeignKey(User, on_delete=models.CASCADE) # foreign key to user model
    currency = models.CharField(max_length=10)
    amount = models.DecimalField(max_digits=20, decimal_places=8) 
    price_at_trade = models.DecimalField(max_digits=20, decimal_places=8) # the price at which the trade was made
    trade_type = models.CharField(max_length=4, choices=TRADE_TYPES) # the type of trade (buy/sell)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} {self.trade_type} {self.amount} {self.currency} at {self.price_at_trade}"
    

class MockBalance(models.Model): # this is a mock balance model for testing purposes
    user = models.ForeignKey(User, on_delete=models.CASCADE) # foreign key to user model
    currency = models.CharField(max_length=10) # currency type
    balance = models.DecimalField(max_digits=20, decimal_places=8) # the amount of money in the account

    def __str__(self):
        return f"{self.user.username} - {self.currency}: {self.balance}" # returns string of user and how much they have in their account