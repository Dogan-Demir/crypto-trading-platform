from django.urls import path
from .views import SubmitSupportTicketView, ListSupportTicketsView

urlpatterns = [
    path('submit/', SubmitSupportTicketView.as_view(), name='submit-support-ticket'),
    path('tickets/', ListSupportTicketsView.as_view(), name='support-tickets'),
]
