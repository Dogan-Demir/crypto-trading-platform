from django.db import models
from django.contrib.auth.models import User

class SupportTicket(models.Model): # this is the support ticket model
    # columns in the table that admin will see
    user = models.ForeignKey(User, on_delete=models.CASCADE) # links the ticket to a user (foreign key)
    subject = models.CharField(max_length=255) # the topic of the ticket
    message = models.TextField() # message that the user sends
    response = models.TextField(blank=True, null=True) # the response from admin
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('closed', 'Closed')], default='open') # shows ticket status to admin and also saves it in db
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self): 
        return f"Ticket #{self.id} from {self.user.username} - {self.subject}" # returns string representation of the ticket and its name 
