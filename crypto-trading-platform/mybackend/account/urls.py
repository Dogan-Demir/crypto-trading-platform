from django.urls import path
from . import views

app_name = 'account'


urlpatterns = [  
    path('dashboard/', views.dashboard, name='dashboard'),  
    path('login/', views.login_view, name='login'),
    path('two_factor/setup/', views.two_factor_setup, name='two_factor_setup'), 
]