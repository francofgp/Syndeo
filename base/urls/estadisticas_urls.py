from django.urls import path
from ..views import estadisticas_views as views

urlpatterns = [
    path('cantidad/repasadas/semana/', views.getCantidadDePalabrasRepasadasUltimaSemana),
    path('cantidad/repasadas/mes/', views.getCantidadDePalabrasRepasadasUltimoMes),
    path('cantidad/repasadas/semana/idioma/', views.getCantidadDePalabrasRepasadasUltimaSemanaPorIdioma),
    path('cantidad/repasadas/mes/idioma/', views.getCantidadDePalabrasRepasadasUltimoMesPorIdioma),
    path('cantidad/nuevas/semana/', views.getCantidadDePalabrasNuevasUltimaSemana),
    path('cantidad/nuevas/mes/', views.getCantidadDePalabrasNuevasUltimoMes),
    path('cantidad/nuevas/semana/idioma/', views.getCantidadDePalabrasNuevasUltimaSemanaPorIdioma),
    path('cantidad/nuevas/mes/idioma/', views.getCantidadDePalabrasNuevasUltimoMesPorIdioma),
    path('cantidad/dificultad/', views.getCantidadDePalabrasPorDificultades),
    path('cantidad/meta/diaria/', views.getMetaDiaria),
    path('cantidad/dificultad/idioma/', views.getCantidadDePalabrasPorDificultadesEIdioma),
    path('cantidad/dificultad/noVistasVistas/idioma/', views.getCantidadDePalabrasNoVistasVistasPorIdioma),
    path('cantidad/aprendidas/semana/idioma/', views.getCantidadDePalabrasAprendidasUltimaSemana),
    path('cantidad/aprendidas/mes/idioma/', views.getCantidadDePalabrasAprendidasUltimoMes),
    path('informacion/perfil/', views.getInformacionPerfil),



    #path('', views.getPalabras),


]
