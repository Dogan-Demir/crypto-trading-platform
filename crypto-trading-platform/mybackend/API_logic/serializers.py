from rest_framework import serializers 
from .models import Deposit, Withdrawal, Trade # it imports the models


class TradeRequestSerializer(serializers.Serializer):
    currency = serializers.CharField()
    amount = serializers.FloatField()

class DepositSerializer(serializers.ModelSerializer): # the serializer for the deposit model
    amount = serializers.FloatField() # amount gets treated as a float

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