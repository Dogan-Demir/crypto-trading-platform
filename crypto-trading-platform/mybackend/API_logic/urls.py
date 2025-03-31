from django.urls import path
from .views.views import getCoinPairs, getCoinPrice, BuyCrypto, SellCrypto, TradeHistory
from .views.dep_withdrw_views import DepositView, WithdrawalView, AllTransactionsView
urlpatterns = [
    path('pairs/', getCoinPairs.as_view(), name = 'get-coin-pairs'),
    path('price/<str:coin>/<str:quote_currency>/', getCoinPrice.as_view(), name = 'get-coin-price'),
    path('buy/', BuyCrypto.as_view(), name = 'buy-crypto'),
    path('sell/', SellCrypto.as_view(), name = 'sell-crypto'),
    path('history/', TradeHistory.as_view(), name = 'trade-history'),
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('withdraw/', WithdrawalView.as_view(), name='withdraw'),
    path('transactions/', AllTransactionsView.as_view(), name='deposits-&withdrawals-history'),
]