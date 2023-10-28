from django.shortcuts import render,redirect
from django.contrib.auth import login, authenticate
from django.views.generic import TemplateView, CreateView,ListView
from django.contrib.auth.views import LoginView as BaseLoginView, LogoutView as BaseLogoutView
from django.urls import reverse_lazy
from .forms import SignUpForm,LoginForm

from django.forms import ModelForm
from .models import Comment,User,Record_othello,Record_snake

# Create your views here.

class IndexView(TemplateView):
    template_name = "index.html"

class SignupView(CreateView):
    form_class = SignUpForm
    template_name = "signup.html"
    success_url = reverse_lazy("myapp:index")
    
    def form_valid(self,form):
        response = super().form_valid(form)
        name = form.cleaned_data.get("name")
        password = form.cleaned_data.get("password")
        user = authenticate(name=name,password=password)
        login(self.request,user)
        return response

class LoginView(BaseLoginView):
    form_class = LoginForm
    template_name = "login.html"

class LogoutView(BaseLogoutView):
    success_url = reverse_lazy("myapp:index")
    
class GamesView(TemplateView):
    template_name = "games.html"


class SnakeView(CreateView):
    def post(self,request):
        if "body" in request.POST:
            name = request.POST['name']
            body = request.POST['body']
            Comment.objects.create(name=name,body=body)
            context = {'comment_list':Comment.objects.all(),}
            return render(request,"myapp/snake_play.html",context)
            
        if "score" in request.POST:
            name = request.POST['name']
            score = request.POST['score']
            Record_othello.objects.create(name=name,score=score)
            context = {'comment_list':Comment.objects.all(),"SQ":SQ}
            return render(request,"myapp/othello_play.html",context)
            
    def get(self,request):
        context = {'comment_list':Comment.objects.all(),}
        return render(request,"myapp/snake_play.html",context)


class OthelloView(CreateView):
    def post(self,request,SQ):
        if "body" in request.POST:
            name = request.POST['name']
            body = request.POST['body']
            Comment.objects.create(name=name,body=body)
            context = {'comment_list':Comment.objects.all(),"SQ":SQ}
            return render(request,"myapp/othello_play.html",context)
        
        if "record" in request.POST:
            name = request.POST['name']
            size = request.POST['size']
            record = request.POST['record']
            Record_othello.objects.create(name=name,size=size,record=record)
            context = {'comment_list':Comment.objects.all(),"SQ":SQ}
            return render(request,"myapp/othello_play.html",context)
        
    def get(self,request,SQ):
        context = {'comment_list':Comment.objects.all(),"SQ":SQ}
        return render(request,"myapp/othello_play.html",context)


class CirclecrossView(CreateView):
    def post(self,request,SQ):
        if "body" in request.POST:
            name = request.POST['name']
            body = request.POST['body']
            Comment.objects.create(name=name,body=body)
            context = {'comment_list':Comment.objects.all(),"SQ":SQ}
            return render(request,"myapp/circle_play.html",context)
            
    def get(self,request,SQ):
        context = {'comment_list':Comment.objects.all(),"SQ":SQ}
        return render(request,"myapp/circlecross_play.html",context)


class SoundView(CreateView):
    def post(self,request):
        if "body" in request.POST:
            name = request.POST['name']
            body = request.POST['body']
            Comment.objects.create(name=name,body=body)
            context = {'comment_list':Comment.objects.all(),}
            return render(request,"myapp/sound_play.html",context)
            
    def get(self,request):
        context = {'comment_list':Comment.objects.all(),}
        return render(request,"myapp/sound_play.html",context)

class TetrisView(CreateView):
    def post(self,request):
        if "body" in request.POST:
            name = request.POST['name']
            body = request.POST['body']
            Comment.objects.create(name=name,body=body)
            context = {'comment_list':Comment.objects.all(),}
            return render(request,"myapp/tetris_play.html",context)
            
    def get(self,request):
        context = {'comment_list':Comment.objects.all(),}
        return render(request,"myapp/tetris_play.html",context)