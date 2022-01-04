import datetime
from datetime import datetime
from sqlite3 import Date
from django.shortcuts import render
from django.http import JsonResponse
# esto sirve para hashear la pass
from django.contrib.auth.hashers import make_password

from ..serializers import PalabrasSerializer

from ..models import Account, Idioma, Texto
from ..models import Palabra

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from random import shuffle
from django.db.models import Count
from django.db.models.functions import TruncDay, Concat
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum

User = Account

# En react
""" 
X = estadistica.map((o)=>Object.keys(o)[0])
Y = estadistica.map((o)=>Object.values(o)[0])
 """

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasRepasadasUltimaSemana(request):
    user=request.user
    dia_hace_una_semana = timezone.now().date() - timedelta(days=7)

    fechaModificacion=[]    
    # Cantidad de palabras repasadas en la ultima semana
    #query = Palabra.historial.filter(usuario=user,fechaUltimoRepaso__gte=dia_hace_una_semana
    #        ).annotate(date=TruncDay('fechaUltimoRepaso')
    #           ).values("date").annotate(created_count=Count('id')).order_by("-date")
    # con historial
    query = Palabra.historial.filter(usuario=user,fechaUltimoRepaso__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaUltimoRepaso')
            ).values("date").annotate(created_count=Count(Concat('cantidadRepasos', 'palabra'),distinct=True)).order_by("-date")
   
    #query = query.annotate(date=TruncDay('fechaUltimoRepaso')
    #        ).values("date").annotate(created_count=Count('id')).order_by("-date")
    # Voy a armar el diccionario
    dias = []
    for i in range(7,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasRepasadasUltimoMes(request):
    user=request.user
    
    dia_hace_una_semana = timezone.now().date() - timedelta(days=30)
    # Cantidad de palabras repasadas en la ultima semana
    # con historial
    query = Palabra.historial.filter(usuario=user,fechaUltimoRepaso__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaUltimoRepaso')
            ).values("date").annotate(created_count=Count(Concat('cantidadRepasos', 'palabra'),distinct=True)).order_by("-date")
   
    #query = Palabra.objects.filter(usuario=user,fechaUltimoRepaso__gte=dia_hace_una_semana
    #        ).annotate(date=TruncDay('fechaUltimoRepaso')
    #        ).values("date").annotate(created_count=Count('id')).order_by("-date")
   

    # Voy a armar el diccionario
    dias = []
    for i in range(30,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasRepasadasUltimaSemanaPorIdioma(request):
    idiomaId=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)

    user=request.user
    
    dia_hace_una_semana = timezone.now().date() - timedelta(days=7)
    # con historial
    query = Palabra.historial.filter(usuario=user,idioma=idioma,fechaUltimoRepaso__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaUltimoRepaso')
            ).values("date").annotate(created_count=Count(Concat('cantidadRepasos', 'palabra'),distinct=True)).order_by("-date")

    """ for item in Palabra.historial.filter(usuario=user,idioma=idioma,fechaUltimoRepaso__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaUltimoRepaso'),repasos=Count(Concat('cantidadRepasos', 'palabra'), distinct=True))\
                            .values( "date", "palabra", 'repasos',"cantidadRepasos").order_by("-date" ,"palabra","repasos","cantidadRepasos"
                            ):
        print(item)  """
    # Cantidad de palabras repasadas en la ultima semana
    #query = Palabra.objects.filter(usuario=user,idioma=idioma,fechaUltimoRepaso__gte=dia_hace_una_semana
    #        ).annotate(date=TruncDay('fechaUltimoRepaso')
    #        ).values("date").annotate(created_count=Count('id')).order_by("-date")
   
    # Voy a armar el diccionario
    dias = []
    for i in range(7,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasRepasadasUltimoMesPorIdioma(request):
    user=request.user
    idiomaId=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    dia_hace_una_semana = timezone.now().date() - timedelta(days=30)

    # con historial
    query = Palabra.historial.filter(usuario=user,idioma=idioma,fechaUltimoRepaso__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaUltimoRepaso')
            ).values("date").annotate(created_count=Count(Concat('cantidadRepasos', 'palabra'),distinct=True)).order_by("-date")
    # Cantidad de palabras repasadas en la ultima semana

    #query = Palabra.objects.filter(usuario=user,idioma=idioma,fechaUltimoRepaso__gte=dia_hace_una_semana
    #        ).annotate(date=TruncDay('fechaUltimoRepaso')
    #        ).values("date").annotate(created_count=Count('id')).order_by("-date")
   

    # Voy a armar el diccionario
    dias = []
    for i in range(30,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasNuevasUltimaSemana(request):
    user=request.user
    
    dia_hace_una_semana = timezone.now().date() - timedelta(days=7)
    # Cantidad de palabras repasadas en la ultima semana
    query = Palabra.objects.filter(usuario=user,fechaLeidaPrimeraVez__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaLeidaPrimeraVez')
            ).values("date").annotate(created_count=Count('id')).order_by("-date")
   
    # Voy a armar el diccionario
    dias = []
    for i in range(7,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasNuevasUltimoMes(request):
    user=request.user
    
    dia_hace_una_semana = timezone.now().date() - timedelta(days=30)
    # Cantidad de palabras repasadas en la ultima semana
    query = Palabra.objects.filter(usuario=user,fechaLeidaPrimeraVez__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaLeidaPrimeraVez')
            ).values("date").annotate(created_count=Count('id')).order_by("-date")
   

    # Voy a armar el diccionario
    dias = []
    for i in range(30,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasNuevasUltimaSemanaPorIdioma(request):
    user=request.user
    idiomaId=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    dia_hace_una_semana = timezone.now().date() - timedelta(days=7)
    # Cantidad de palabras repasadas en la ultima semana
    query = Palabra.objects.filter(usuario=user,idioma=idioma,fechaLeidaPrimeraVez__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaLeidaPrimeraVez')
            ).values("date").annotate(created_count=Count('id')).order_by("-date")
   
    # Voy a armar el diccionario
    dias = []
    for i in range(7,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasNuevasUltimoMesPorIdioma(request):
    user=request.user
    idiomaId=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    dia_hace_una_semana = timezone.now().date() - timedelta(days=30)
    # Cantidad de palabras repasadas en la ultima semana
    query = Palabra.objects.filter(usuario=user,idioma=idioma,fechaLeidaPrimeraVez__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaLeidaPrimeraVez')
            ).values("date").annotate(created_count=Count('id')).order_by("-date")
   

    # Voy a armar el diccionario
    dias = []
    for i in range(30,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasAprendidasUltimaSemana(request):
    user=request.user
    idiomaId=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    dia_hace_una_semana = timezone.now().date() - timedelta(days=7)
    # Cantidad de palabras repasadas en la ultima semana
    query = Palabra.objects.filter(usuario=user,idioma=idioma,dificultad=4,fechaModificacion__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaModificacion')
            ).values("date").annotate(created_count=Count('id')).order_by("-date")
   
    # Voy a armar el diccionario
    dias = []
    for i in range(7,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasAprendidasUltimoMes(request):
    user=request.user
    idiomaId=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    dia_hace_una_semana = timezone.now().date() - timedelta(days=30)
    # Cantidad de palabras repasadas en la ultima semana
    query = Palabra.objects.filter(usuario=user,dificultad=4,idioma=idioma,fechaModificacion__gte=dia_hace_una_semana
            ).annotate(date=TruncDay('fechaModificacion')
            ).values("date").annotate(created_count=Count('id')).order_by("-date")
   

    # Voy a armar el diccionario
    dias = []
    for i in range(30,-1,-1):
        dias.append(str(timezone.now().date() - timedelta(days=i)))
    
    estadistica = []
    for dia in dias:
        #Busco la fecha en la query
        existeFecha=False
        for q in query:
            if str(q["date"])==dia:
                existeFecha=True
        if existeFecha:
            #consigo el valor
            valor =0
            for elemento in query:
                if str(elemento["date"])==(dia):
                    valor=elemento["created_count"]
                    break
            estadistica.append({dia:valor})
        else:
            estadistica.append({dia:0})

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasPorDificultades(request):
    user=request.user
    NOVISTA=0
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4
    # Estadística

    estadistica = [{"No vistas": Palabra.objects.filter(usuario=user,dificultad=NOVISTA).count()},
                    {
                    "Fáciles": Palabra.objects.filter(usuario=user,dificultad=FACIL).count()
                    },
                    {
                    "Medias": Palabra.objects.filter(usuario=user,dificultad=MEDIA).count()
                    },
                    {
                    "Difíciles": Palabra.objects.filter(usuario=user,dificultad=DIFICIL).count()
                    },
                    {
                    "Aprendidas": Palabra.objects.filter(usuario=user,dificultad=APRENDIDA).count()
                    },
                    ]

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasPorDificultadesEIdioma(request):
    idiomaId=orden=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    user=request.user
    NOVISTA=0
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4
    # Estadística

    estadistica = [{"No vistas": Palabra.objects.filter(usuario=user,dificultad=NOVISTA,idioma=idioma).count()},
                    {
                    "Fáciles": Palabra.objects.filter(usuario=user,dificultad=FACIL,idioma=idioma).count()
                    },
                    {
                    "Medias": Palabra.objects.filter(usuario=user,dificultad=MEDIA,idioma=idioma).count()
                    },
                    {
                    "Difíciles": Palabra.objects.filter(usuario=user,dificultad=DIFICIL,idioma=idioma).count()
                    },
                    {
                    "Aprendidas": Palabra.objects.filter(usuario=user,dificultad=APRENDIDA,idioma=idioma).count()
                    },
                    ]

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCantidadDePalabrasNoVistasVistasPorIdioma(request):
    idiomaId=orden=request.query_params.get('idiomaId')
    idioma = Idioma.objects.get(id=idiomaId)
    user=request.user
    NOVISTA=0
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4
    # Estadística

    estadistica = [{"No vistas": Palabra.objects.filter(usuario=user,dificultad=NOVISTA,idioma=idioma).count()},
                    {
                    "Nuevas": Palabra.objects.filter(usuario=user,dificultad__in=(FACIL,MEDIA,DIFICIL,APRENDIDA),idioma=idioma).count()
                    }
                    ]

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getInformacionPerfil(request):    
    user=request.user
    NOVISTA=0
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4
    # Estadística

    cantidadPalabrasLeidas = Texto.objects.filter(usuario=user,completado=True
                            ).aggregate(Sum('cantidadPalabras'))['cantidadPalabras__sum']
    
    cantidadTextosLeidos = Texto.objects.filter(usuario=user,completado=True
                            ).count()

    cantidadVocabulario = Palabra

    estadistica = [{"palabrasLeidas": cantidadPalabrasLeidas},
                    {
                    "textosLeidos":cantidadTextosLeidos
                    },
                    {
                    "cantidadVocabulario": Palabra.objects.filter(usuario=user,dificultad__in=(FACIL,MEDIA,DIFICIL,APRENDIDA)).count()
                    }
                    ]
    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMetaDiaria(request):
    user=request.user
    hoy = datetime.now()
    
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4

    cantidad = Palabra.objects.filter(usuario=user,fechaLeidaPrimeraVez=hoy, dificultad__in=(FACIL,MEDIA,DIFICIL,APRENDIDA)).count()

    estadistica = [{"cantidad": cantidad
                    },
                    {
                        "meta":user.metaDiaria
                    },
                    {
                        "esMeta": user.metaDiaria<=cantidad
                    },
                    {
                        "fecha":timezone.now().date()
                    }
                    ]

    try:
        return Response({'estadistica':estadistica})
    except Exception as e: 
        print(e)
        return Response({'estadistica':[]})
