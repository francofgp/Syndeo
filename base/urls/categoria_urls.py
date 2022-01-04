from django.urls import path
from ..views import categoria_views as views

urlpatterns = [
    path('', views.getCategorias),
    path('crear/', views.registerCategoria), 
    path('<str:pk>/', views.getCategoria),       
    path('update/<str:pk>/', views.updateCategoria),        
    path('delete/<str:pk>/', views.deleteCategoria),
]
