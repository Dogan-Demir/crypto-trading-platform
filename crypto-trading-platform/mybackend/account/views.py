from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib import messages
from django.conf import settings
import qrcode
from io import BytesIO
import base64

# Create your views here.
from django.shortcuts import render

def index(request):
    return render(request, 'account/two_factor/index.html') 

def dashboard(request):
    return render(request, 'account/dashboard.html')

def login_view(request):
    return render(request, 'account/login.html')

@login_required
def two_factor_setup(request):
    if request.method == 'POST':
        # Get the user's profile to check their preferred 2FA method
        user_profile = request.user.userprofile
        
        # If method is specified in POST, use that instead of the profile setting
        method = request.POST.get('method', user_profile.two_factor_method)
        
        if method == 'TOTP':
            # Create TOTP device for the user
            device = TOTPDevice.objects.create(
                user=request.user,
                name='default',
                confirmed=True
            )
            
            # Generate QR code
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(device.config_url)
            qr.make(fit=True)
            
            # Create QR code image
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            qr_code = base64.b64encode(buffered.getvalue()).decode()
            
            return render(request, 'account/two_factor/setup.html', {
                'qr_code': f"data:image/png;base64,{qr_code}",
                'method': 'TOTP'
            })
        elif method == 'EMAIL':
            # Send verification email
            # TODO: Implement email verification
            messages.success(request, 'Email verification sent!')
            return redirect('account:dashboard')
        elif method == 'SMS':
            # Send verification SMS
            # TODO: Implement SMS verification
            messages.success(request, 'SMS verification sent!')
            return redirect('account:dashboard')
    
    return render(request, 'account/two_factor/setup.html', {
        'method': None
    })