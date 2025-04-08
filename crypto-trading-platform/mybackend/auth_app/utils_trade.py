from .models import MockBalance
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
# This file contains utility functions for managing user balances in a mock trading environment.

#This method is used to get the balance of a user for a specific currency.
# It first tries to retrieve the balance from the database. If it doesn't exist, it creates a new balance object with a default value of 0.0.
def get_MockBalance(user, currency):        
    try:
        return MockBalance.objects.get(user=user, currency=currency.upper()) # try to get the balance object for the user and currency
    except ObjectDoesNotExist:
        raise ValueError(f"Balance for {currency.upper()} not found for user {user.username}.") # raise an error if the balance does not exist

#This method is used to update the balance of a user for a specific currency.
def update_balance(user, currency, change):
    try:
        balance = get_MockBalance(user, currency)
    except ValueError:
        if currency.upper() == "USD":
            raise ValueError("Cannot create a new USD balance. Please contact support.") # raise an error if trying to create a new USD balance
        balance = MockBalance.objects.create(user=user, currency=currency.upper(), balance=Decimal("0.0")) # create a new balance object with 0.0 if it doesn't exist
    
    balance.balance += Decimal(change) # update the balance with the new amount
    balance.save() # save the changes to the database
    return balance

#This method checks if a user has sufficient balance for a specific currency and amount.
def has_sufficient_balance(user, currency, amount):
    balance = get_MockBalance(user, currency)
    return balance.balance >= Decimal(amount) # check if the balance is greater than or equal to the amount