from rest_framework import serializers

class TradeRequestSerializer(serializers.Serializer):
    cryptocurrency = serializers.CharField()
    amount = serializers.FloatField()