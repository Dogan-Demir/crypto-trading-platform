from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def index(request):
    return render(request, 'account/two_factor/index.html') 

def dashboard(request):
    return render(request, 'account/dashboard.html')

def login_view(request):
    return render(request, 'account/login.html')

def two_factor_setup(request):
    return render(request, 'account/two_factor/setup.html')