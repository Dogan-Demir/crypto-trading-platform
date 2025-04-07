from rest_framework import serializers 
from .models import Deposit, Withdrawal, Trade, MockBalance # it imports the models
from decimal import Decimal, getcontext
getcontext().prec = 18 # set the precision for decimal operations to 18

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