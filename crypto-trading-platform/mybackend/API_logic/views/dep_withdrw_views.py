from rest_framework.views import APIView # imports APIView class
from rest_framework.response import Response # imports response to be able to returns JSON responses
from rest_framework import status # imports http status codes
import requests # imports requests library
from ..models import Deposit, Withdrawal # imports the db model we made for deposits and withdrawals
from ..serializers import DepositSerializer, WithdrawalSerializer # imports the serializers for the deposit and withdrawal models

from django.contrib.auth.models import User # TEST - imports the User model for testing purposes (will be removed later)


class DepositView(APIView): # this class handles the deposit requests

    # it uses a POST request to handle the deposit and validates it using the DepositSerializer
    def post(self, request):
        serializer = DepositSerializer(data=request.data) # creates serializer instance with the data from the request (whcih is amount and currency)

        if serializer.is_valid(): 

            test_user, _  = User.objects.get_or_create(username="testuser") # TEST - it gets or creates a test user for testing purposes of the deposit

            serializer.save(user=test_user, status="completed")  # if data is valid, it saves the deposit and changs status to completed
            # it returns message to say successful and the deposit data
            return Response({"message": "Deposit successful", "data": serializer.data}, status=status.HTTP_201_CREATED) # http status code 201 shows its successfully created
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # but if data is invalid, it returns errors and a http 400
    

class WithdrawalView(APIView): # handles withdrawal requests

    # all very similar to the deposit view just now for withdrawals
    def post(self, request):
        serializer = WithdrawalSerializer(data=request.data)

        test_user, _  = User.objects.get_or_create(username="testuser") # TEST - it gets or creates a test user for testing purposes of the deposit
        
        if serializer.is_valid():
            serializer.save(user=test_user, status="completed")  
            return Response({"message": "Withdrawal successful", "data": serializer.data}, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AllTransactionsView(APIView): #view returns all deposits and withdrawals in the db table
    def get(self, request):
        return Response({ 
            "deposits": DepositSerializer(Deposit.objects.all(), many=True).data, # gets records of all deposits, serializes them and returns them in JSON format
            "withdrawals": WithdrawalSerializer(Withdrawal.objects.all(), many=True).data #does the same for withdrawals
        })
