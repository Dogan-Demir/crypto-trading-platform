from rest_framework import serializers
from .models import SupportTicket # imports the SupportTicket model from models.py

class TicketSerializer(serializers.ModelSerializer): # serializer for the support ticket model

    class Meta: 
        model = SupportTicket # based on SupportTicket model
        fields = ['id', 'subject', 'message', 'response', 'status', 'created_at'] # these filds will be in the table
        read_only_fields = ['response', 'status', 'created_at'] # the user cant set these fields when they make a ticket
