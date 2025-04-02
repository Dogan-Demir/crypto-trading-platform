from django.contrib import admin
from .models import UserProfile, Cryptocurrency, Transaction, Portfolio

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'created_at')
    search_fields = ('user__username',)

@admin.register(Cryptocurrency)
class CryptocurrencyAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name', 'current_price', 'last_updated')
    search_fields = ('symbol', 'name')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'cryptocurrency', 'transaction_type', 'amount', 'price_at_transaction', 'timestamp')
    list_filter = ('transaction_type', 'cryptocurrency')
    search_fields = ('user__username',)

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'cryptocurrency', 'amount', 'last_modified')
    search_fields = ('user__username',)
