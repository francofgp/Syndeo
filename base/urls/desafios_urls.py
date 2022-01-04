from django.urls import path
from ..views import desafios_views as views

urlpatterns = [
    path('', views.getDesafios),
    path('crear/', views.registerDesafio), 
    path('<str:pk>/', views.getDesafio),       
    path('update/<str:pk>/', views.updateDesafio),     
    path('delete/<str:pk>/', views.deleteDesafio),
]
