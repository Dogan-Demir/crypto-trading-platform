
from rest_framework import generics
from .serializers import SignupSerializer

from rest_framework.response import Response
from rest_framework import status

class SignUpView(generics.GenericAPIView):
    serializer_class = SignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        print(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.http import HttpResponse

def index(request):
    return HttpResponse("Welcome to the crypto trading platform!")
