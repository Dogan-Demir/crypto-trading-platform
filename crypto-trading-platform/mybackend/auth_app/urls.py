from django.urls import path
from .views import (
    SignUpView, TransactionListView,
    PortfolioView, CryptocurrencyListView,
    LoginView, get_balance,
    get_2fa_method, verify_2fa_token,
    getCoinPairsView, 
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
    # POST /api/signup/ - Create new user
    path('signup/', SignUpView.as_view(), name='signup'),
    # GET/POST /api/transactions/ - List or create transactions
    path('user-transactions/', TransactionListView.as_view(), name='transactions'),
    # GET /api/portfolio/ - View portfolio
    path('portfolio/', PortfolioView.as_view(), name='portfolio'),
    # GET /api/cryptocurrencies/ - List available cryptocurrencies
    path('cryptocurrencies/', CryptocurrencyListView.as_view(), name='cryptocurrencies'),
    path('login/', LoginView.as_view(), name='login'),
    path('balance/', get_balance, name='balance'),
    # 2FA endpoints
    path('2fa/method/', get_2fa_method, name='get_2fa_method'),
    path('2fa/verify/', verify_2fa_token, name='verify_2fa_token'),
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
