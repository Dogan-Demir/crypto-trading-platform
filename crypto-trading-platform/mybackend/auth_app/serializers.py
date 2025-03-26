from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework import serializers

# Custom password validation
def validate_password(value):
    if len(value) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    if not any(char.isdigit() for char in value):
        raise ValidationError("Password must contain at least one digit.")
    if not any(char.isalpha() for char in value):
        raise ValidationError("Password must contain at least one letter.")
    if not any(char in "?!@#$%^&*()-_=+" for char in value):
        raise ValidationError("Password must contain at least one special character.")
    return value

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        # Check if the passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        
        # Check if the email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return data

    def create(self, validated_data):
        # Remove password2 as it's not part of the User model
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
