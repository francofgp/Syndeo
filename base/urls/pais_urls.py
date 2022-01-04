from django.urls import path
from ..views import pais_views as views     

urlpatterns = [
    path('', views.getPaises),
    path('crear/', views.registerPais), 
    path('<str:pk>/', views.getPais),   
    path('update/<str:pk>/', views.updatePais),             
    path('delete/<str:pk>/', views.deletePais),
    
]