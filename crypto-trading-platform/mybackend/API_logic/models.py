from django.db import models 
from django.contrib.auth.models import User # impots the User model from Django

class Deposit(models.Model): # this is the database model for storing info on deposits
# columns in the db table
    user = models.ForeignKey(User, on_delete=models.CASCADE) # foriegn key to user model
    amount = models.DecimalField(max_digits=12, decimal_places=2) # the amount whichll get deposited
    currency = models.CharField(max_length=10) #currency 
    timestamp = models.DateTimeField(auto_now_add=True) # it exact timestamp when it happens gets automatically added
    status = models.CharField(max_length=20, default="pending") # inititally shows status as pending by default until set to completeed

    def __str__(self): 
        return f"{self.user.username} deposited {self.amount} {self.currency}" # returns string of user and how much they deposited

class Withdrawal(models.Model): # withdrawal db model
    
    # similar columns to the deposits model
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    destination_address = models.CharField(max_length=255) # this is the address to send the money to
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="pending")

    def __str__(self):
        return f"{self.user.username} withdrew {self.amount} {self.currency} to {self.destination_address}" # returns string of user, how much they withdrew and to where


