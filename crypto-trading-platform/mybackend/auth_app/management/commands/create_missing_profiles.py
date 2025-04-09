from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from auth_app.models import UserProfile


class Command(BaseCommand):
    help = 'Creates UserProfile objects for any users that do not already have one'

    def handle(self, *args, **options):
        users_without_profile = []
        
        # Find users without a profile
        for user in User.objects.all():
            try:
                # Try to access the profile
                profile = user.userprofile
            except UserProfile.DoesNotExist:
                # If it doesn't exist, add to our list
                users_without_profile.append(user)
        
        # Create profiles for users who don't have one
        profiles_created = 0
        for user in users_without_profile:
            UserProfile.objects.create(user=user)
            profiles_created += 1
            self.stdout.write(self.style.SUCCESS(f'Created profile for user: {user.username}'))
        
        # Summary message
        if profiles_created > 0:
            self.stdout.write(self.style.SUCCESS(f'Successfully created {profiles_created} user profiles'))
        else:
            self.stdout.write(self.style.SUCCESS('All users already have profiles')) 