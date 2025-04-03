from .models import MockBalance
from decimal import Decimal

# This file contains utility functions for managing user balances in a mock trading environment.

#This method is used to get the balance of a user for a specific currency.
# It first tries to retrieve the balance from the database. If it doesn't exist, it creates a new balance object with a default value of 0.0.
def get_balance(user, currency):
    obj,_= MockBalance.objects.get_or_create(user=user, currency=currency.upper()) # get or create a mock balance object for the user and currency
    return obj

#This method is used to update the balance of a user for a specific currency.
def update_balance(user, currency, change):
    balance = get_balance(user, currency) # get the balance object for the user and currency
    balance.balance += Decimal(change) # update the balance with the new amount
    balance.save() # save the changes to the database
    return balance

#This method checks if a user has sufficient balance for a specific currency and amount.
def has_sufficient_balance(user, currency, amount):
    balance = get_balance(user, currency) # get the balance object for the user and currency
    return balance.balance >= Decimal(amount) # check if the balance is greater than or equal to the amount