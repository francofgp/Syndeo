from django.urls import path
from ..views import idioma_views as views

urlpatterns = [
    path('idiomasuser/', views.getIdiomasUser),

    path('crear/', views.registerIdioma), 
    path('<str:pk>/', views.getIdioma),      
    path('update/<str:pk>/', views.updateIdioma),      
    path('delete/<str:pk>/', views.deleteIdioma),
        path('', views.getIdiomas),

]