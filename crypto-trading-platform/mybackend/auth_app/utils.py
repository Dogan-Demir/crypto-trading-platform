import random
import string
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client

def generate_verification_code():
    """Generate a 6-digit verification code."""
    return ''.join(random.choices(string.digits, k=6))

def send_email_verification(user):
    """Send verification code via email."""
    code = generate_verification_code()
    user.userprofile.email_verification_code = code
    user.userprofile.save()

    subject = 'Your Two-Factor Authentication Code'
    message = f'Your verification code is: {code}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)
    return code

def send_sms_verification(user):
    """Send verification code via SMS using Twilio."""
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_PHONE_NUMBER]):
        print("Twilio credentials not configured. SMS verification code:", user.userprofile.sms_verification_code)
        return
    
    code = generate_verification_code()
    user.userprofile.sms_verification_code = code
    user.userprofile.save()
    
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=f'Your verification code is: {code}',
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.userprofile.phone_number
        )
        print(f"SMS sent to {user.userprofile.phone_number}. Message SID: {message.sid}")
    except Exception as e:
        print(f"Error sending SMS: {str(e)}")
        # Still save the code even if SMS fails
        user.userprofile.sms_verification_code = code
        user.userprofile.save()
    return code 