from django.urls import path
from ..views import palabra_views as views

urlpatterns = [
    path('', views.getPalabras),
    path('repasar/', views.getPalabraParaRepasar),
    path('repasar/actualizar/', views.actualizarPalabraParaRepasar),
    path('obtener/traduccion/', views.getBuscarTraduccion),
    path('exportar/pdf/', views.getPalabraParaPDF),
    path('updatefrase/', views.updateFrase),
    path('user/<str:pk>/', views.getPalabrasUsuario),
    path('update/<str:pk>/', views.updatePalabra),
    path('texto/<str:pk>/', views.getPalabrasTexto),
    path('<str:pk>/', views.getPalabra),

]
