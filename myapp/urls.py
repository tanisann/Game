from django.urls import path
from . import views

app_name = "myapp"

urlpatterns = [
    path('', views.IndexView.as_view(),name="index"),
    path('signup/',views.SignupView.as_view(),name="signup"),
    path('login/',views.LoginView.as_view(),name="login"),
    path('logout/',views.LogoutView.as_view(),name="logout"),
    path('snake/',views.SnakeView.as_view(),name="snake"),
    path('othello/<int:SQ>',views.OthelloView.as_view(),name="othello"),
    path('circlecross/<int:SQ>',views.CirclecrossView.as_view(),name="circlecross"),
    path('sound',views.SoundView.as_view(),name="sound"),
    path('tetris',views.TetrisView.as_view(),name="tetris"),
    path('games/',views.GamesView.as_view(),name="games"),
]