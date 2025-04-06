from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import SupportTicket # imports the SupportTicket model from models.py
from .serializers import TicketSerializer 

class SubmitSupportTicketView(APIView): 

    permission_classes = [permissions.IsAuthenticated] # only an authenticated user can create a support ticket

    def post(self, request): #post method when user creates a ticket
        serializer = TicketSerializer(data=request.data) #makes instance of it with request data

        if serializer.is_valid(): 
            serializer.save(user=request.user) #if data valid, saves it to the db and links it to user 

            return Response({"message": "Support ticket created successfully"}, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) #if invalid returns error

class ListSupportTicketsView(APIView): # view for listing support tickets
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request): #get method to view tickets
        tickets = SupportTicket.objects.filter(user=request.user) # it gets all tickets linked to the user
        serializer = TicketSerializer(tickets, many=True) 
        return Response(serializer.data)
