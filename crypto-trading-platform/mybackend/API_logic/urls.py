from django.urls import path
from .views import (getCoinPairsView, 
                          getCoinPriceView, 
                          BuyCryptoView, 
                          SellCryptoView, 
                          TradeHistoryView, 
                          DepositView, 
                          WithdrawalView, 
                          AllTransactionsView,
                          GetBalanceView,
                          StartBalanceView,
                          )

urlpatterns = [
    path('pairs/', getCoinPairsView.as_view(), name = 'get-coin-pairs'),
    path('price/<str:coin>/<str:quote_currency>/', getCoinPriceView.as_view(), name = 'get-coin-price'),
    path('buy/', BuyCryptoView.as_view(), name = 'buy-crypto'),
    path('sell/', SellCryptoView.as_view(), name = 'sell-crypto'),
    path('history/', TradeHistoryView.as_view(), name = 'trade-history'),
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('withdraw/', WithdrawalView.as_view(), name='withdraw'),
    path('transactions/', AllTransactionsView.as_view(), name='all-transactions'),
    path('balances/', GetBalanceView.as_view()), # Added this line to include the new endpoint
    path('start-balance/', StartBalanceView.as_view(), name = 'start-balance'),
]