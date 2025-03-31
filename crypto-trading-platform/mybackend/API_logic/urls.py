from django.urls import path
from .views import getCoinPairs, getCoinPrice, BuyCrypto, SellCrypto, TradeHistory

urlpatterns = [
    path('pairs', getCoinPairs.as_view(), name = 'get-coin-pairs'),
    path('price/<str:coin>/<str:quote_currency>', getCoinPrice.as_view(), name = 'get-coin-price'),
    path('buy', BuyCrypto.as_view(), name = 'buy-crypto'),
    path('sell', SellCrypto.as_view(), name = 'sell-crypto'),
    path('history/', TradeHistory.as_view(), name = 'trade-history'),
]