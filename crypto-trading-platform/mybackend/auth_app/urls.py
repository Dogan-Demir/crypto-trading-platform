from django.urls import path
from .views import (
    SignUpView, TransactionListView,
    PortfolioView, CryptocurrencyListView,
    LoginView, DepositView, get_balance,
    get_2fa_method, verify_2fa_token
)
from . import trade_views

urlpatterns = [
    # POST /api/signup/ - Create new user
    path('signup/', SignUpView.as_view(), name='signup'),
    # GET/POST /api/transactions/ - List or create transactions
    path('transactions/', TransactionListView.as_view(), name='transactions'),
    # GET /api/portfolio/ - View portfolio
    path('portfolio/', PortfolioView.as_view(), name='portfolio'),
    # GET /api/cryptocurrencies/ - List available cryptocurrencies
    path('cryptocurrencies/', CryptocurrencyListView.as_view(), name='cryptocurrencies'),
    path('login/', LoginView.as_view(), name='login'),
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('balance/', get_balance, name='balance'),
    path('trade/', trade_views.trade, name='trade'),
    # 2FA endpoints
    path('2fa/method/', get_2fa_method, name='get_2fa_method'),
    path('2fa/verify/', verify_2fa_token, name='verify_2fa_token'),
]
