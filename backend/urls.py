"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
#from backend.base import base
from django.views.generic import TemplateView


urlpatterns = [
   
    path('admin/', admin.site.urls),
    
    path('api/users/', include('base.urls.user_urls')),
    path('api/paises/', include('base.urls.pais_urls')),
    path('api/idiomas/', include('base.urls.idioma_urls')),
    path('api/categorias/', include('base.urls.categoria_urls')),
    path('api/desafios/', include('base.urls.desafios_urls')),
    path('api/textos/', include('base.urls.texto_urls')),
    path('api/palabras/', include('base.urls.palabra_urls')),
    path('api/estadisticas/', include('base.urls.estadisticas_urls')),
    # Esto me da en la interfaz de django
    path('api-auth/', include('rest_framework.urls')),
    # Rest la habilidad para logearme y deslogearme de usuario
    path('auth/', include('djoser.urls')),
     path("",TemplateView.as_view(template_name="index.html")),
]
# https://docs.djangoproject.com/en/2.1/howto/static-files/#serving-files-uploaded-by-a-user-during-development
# aca se setea la ruta para guardar las imagenes y acceder, esto es asi de fabrica
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)