from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django import forms
from .models import User, Comment

class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("name",)

class LoginForm(AuthenticationForm):
    class Meta:
        model = User

