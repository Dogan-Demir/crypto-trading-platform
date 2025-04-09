from django.apps import AppConfig


class AuthAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_app'

    def ready(self):
        """
        Import signals module when the app is ready
        """
        # Import signals module
        import auth_app.signals
