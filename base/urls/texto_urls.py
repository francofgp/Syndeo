from django.urls import path
from ..views import texto_views as views

urlpatterns = [
    path('traducir/',views.getTraduccion),
    path('marcarComoLeido/<str:pk>',views.marcarComoLeido),
    path('', views.getTextos),
    path('checkTexto/', views.checkTexto),    
    path('user/busqueda/', views.getBuscarTexto),
    path('user/<str:pk>/', views.getTextoUsuario),
    path('setFechaUltimaLectura/<str:pk>',views.setFechaUltimaLectura),
    path('crear/', views.registerTextos),
    path('update/imageprofile/', views.uploadImageTexto),
    path('update/<str:pk>/', views.updateTexto),
    path('delete/<str:pk>/', views.deleteTexto),    
     path('mejorado/<str:pk>/', views.getTextoMejorado), 
    path('<str:pk>/', views.getTexto),
]
