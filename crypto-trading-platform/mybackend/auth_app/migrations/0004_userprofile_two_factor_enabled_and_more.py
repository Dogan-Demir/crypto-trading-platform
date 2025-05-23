# Generated by Django 5.1.7 on 2025-04-07 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0003_alter_deposit_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='two_factor_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='two_factor_method',
            field=models.CharField(blank=True, choices=[('EMAIL', 'Email'), ('SMS', 'SMS'), ('TOTP', 'Authenticator App')], max_length=10, null=True),
        ),
    ]
