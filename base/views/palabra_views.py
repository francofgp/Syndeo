import datetime
from sqlite3 import Date
from django.shortcuts import render
from django.http import JsonResponse
# esto sirve para hashear la pass
from django.contrib.auth.hashers import make_password

from ..serializers import PalabrasSerializer, PalabrasSerializerReducido
from django.core.exceptions import ObjectDoesNotExist

from ..models import Account, Idioma, Texto
from ..models import Palabra

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from random import shuffle
User = Account


@api_view(['GET'])
# @permission_classes([IsAdminUser])
def getPalabras(request):
    palabra = Palabra.objects.all()
    serializers = PalabrasSerializer(palabra, many=True)
    return Response(serializers.data)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getPalabra(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    palabra = Palabra.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = PalabrasSerializer(palabra, many=False)
    return Response(serializers.data)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getPalabrasTexto(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    palabras = Palabra.objects.filter(texto=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = PalabrasSerializer(palabras, many=True)
    return Response(serializers.data)


@api_view(['PUT'])
#@permission_classes([IsAuthenticated])
def updatePalabra(request, pk):
    
    print(request.data)
    FACIL=1
    MEDIA=2
    DIFICIL=3
    cantidadDeRepasosHastaElProximoNivel=0
    try:

        #pais = request.Pais
        palabra = Palabra.objects.get(id=pk)
        serializers = PalabrasSerializerReducido(palabra, many=False)

        data = request.data
        if data['dificultad']==FACIL:
            cantidadDeRepasosHastaElProximoNivel=1
        if data['dificultad']==MEDIA:
            cantidadDeRepasosHastaElProximoNivel=2
        if data['dificultad']==DIFICIL:
            cantidadDeRepasosHastaElProximoNivel=3
        #product = Product.objects.get(_id=pk)
        
        if data['dificultad']!="":
            palabra.dificultad = data['dificultad']
        if data['traduccion']!="":
            palabra.traduccion = data['traduccion']

        palabra.cantidadDeRepasosHastaElProximoNivel=cantidadDeRepasosHastaElProximoNivel
        if palabra.fechaLeidaPrimeraVez==None:
            palabra.fechaLeidaPrimeraVez=datetime.date.today()
        palabra.save()
        return Response(serializers.data)
    except Exception as e: 
        print(e)
        message = {'detail': 'Campos inválidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def updateFrase(request):
    FACIL=1
    MEDIA=2
    DIFICIL=3
    cantidadDeRepasosHastaElProximoNivel=0
    try:
        if request.data['dificultad'] != "":
            if request.data['dificultad']==FACIL:
                cantidadDeRepasosHastaElProximoNivel=1
            if request.data['dificultad']==MEDIA:
                cantidadDeRepasosHastaElProximoNivel=2
            if request.data['dificultad']==DIFICIL:
                cantidadDeRepasosHastaElProximoNivel=3
        
            

        
        if request.data['frase']!="" and request.data['frase']!=" " :
            #pais = request.Pais
            data = request.data
            print(data)
            texto = Texto.objects.get(id=data['texto'])
            if Palabra.objects.filter(palabra=data['frase'],texto=texto).exists():

                frase=Palabra.objects.get(palabra=data['frase'],texto=texto)
                if data['traduccion']!="":
                    frase.traduccion=data['traduccion']
                    
                if data['dificultad'] != "":
                    frase.dificultad=data['dificultad']
                
                frase.idioma_id=data['idioma']
                frase.usuario_id=data['usuario']
                frase.cantidadDeRepasosHastaElProximoNivel=cantidadDeRepasosHastaElProximoNivel
                frase.esFrase=True
                frase.save()
                serializers = PalabrasSerializer(frase, many=False)
                return Response(serializers.data)


            frase=Palabra()
            frase.cantidadDeRepasosHastaElProximoNivel=cantidadDeRepasosHastaElProximoNivel
            frase.traduccion=data['traduccion']
            frase.usuario_id=data['usuario']   
            if data['dificultad'] != "": 
                frase.dificultad=data['dificultad']
            frase.palabra=data['frase']
            frase.idioma_id=data['idioma']
            frase.esFrase=True
            frase.fechaLeidaPrimeraVez=datetime.date.today()
            frase.save()
            frase.texto.add(texto)
            frase.save()
            frase = Palabra.objects.get(id=frase.id)
            serializers = PalabrasSerializer(frase, many=False)
            return Response(serializers.data)
        else:
            message = {'detail': 'No proporcionó una frase'}
            
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        message = {'detail': 'Inválido'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPalabrasUsuario(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    palabras = Palabra.objects.filter(usuario=pk).filter(dificultad__in=(1,2,3,4))
    # vamos a usar el token para gestionar los usuarios
    
    
    
    serializers = PalabrasSerializer(palabras, many=True)
    return Response(serializers.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPalabraParaRepasar(request):
    user=request.user
    cantidad=int(request.query_params.get('cantidad'))
    idioma=request.query_params.get('idioma')
    orden=request.query_params.get('orden')

    idioma=Idioma.objects.get(pk=idioma)
    try:
        if orden=="nuevas":
            palabra = Palabra.objects.filter(idioma=idioma,usuario=user,traduccion__isnull=False
                                ).exclude(dificultad__in=(0,4,5)
                                ).order_by("-fechaModificacion")[:cantidad]
        else:
            palabra = Palabra.objects.filter(idioma=idioma,usuario=user,traduccion__isnull=False
                                ).exclude(dificultad__in=(0,4,5)
                                ).order_by("fechaModificacion")[:cantidad]

        print(palabra[0].id)
        
        serializers = PalabrasSerializer(palabra, many=True)
        return Response(serializers.data)
    except Exception as e: 
        print(e)
        Response({'palabra':[]})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizarPalabraParaRepasar(request):
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4
    user=request.user
    data =request.data
    idIdiomas=[x['id'] for x in data]
    print(tuple(idIdiomas))
    
    palabras = Palabra.objects.filter(id__in=idIdiomas) 

    for palabra in palabras:
        # Aumento en 1 la cantidad de repasos
        palabra.cantidadRepasos+=1
        # Resto la cantidad de repasos y me dijo si es null, sino da error
        if palabra.cantidadDeRepasosHastaElProximoNivel!=None:
            if palabra.cantidadDeRepasosHastaElProximoNivel>0:
                palabra.cantidadDeRepasosHastaElProximoNivel-=1
        else:
            palabra.cantidadDeRepasosHastaElProximoNivel=0
        # Seteo la fecha del ultimo repaso
        palabra.fechaUltimoRepaso=datetime.date.today()

        # Compruebo si la cantidad de repasos hasta el proximo nivel es cero y actualizo
        # en funcion de eso
        if palabra.cantidadDeRepasosHastaElProximoNivel==0:
            if palabra.dificultad==FACIL:
                palabra.dificultad=APRENDIDA
                palabra.cantidadDeRepasosHastaElProximoNivel=0
            if palabra.dificultad==MEDIA:
                palabra.dificultad=FACIL
                palabra.cantidadDeRepasosHastaElProximoNivel=1
            if palabra.dificultad==DIFICIL:
                palabra.dificultad=MEDIA
                palabra.cantidadDeRepasosHastaElProximoNivel=2
            
        palabra.save()


    serializers = PalabrasSerializer(palabras, many=True)
    return Response(serializers.data) 



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPalabraParaPDF(request):
    user=request.user
    idioma=request.query_params.get('idioma')
    dificultad=int(request.query_params.get('dificultad'))
    FACIL=1
    MEDIA=2
    DIFICIL=3
    APRENDIDA=4
    TODAS=5


    idioma=Idioma.objects.get(pk=idioma)
    try:
        palabra=[]

        if dificultad ==TODAS:
            palabra = Palabra.objects.filter(idioma=idioma,usuario=user,dificultad__in=(1,2,3,4)
                                ).order_by("-fechaModificacion")
        else:
            palabra = Palabra.objects.filter(idioma=idioma,usuario=user,dificultad=dificultad
                                ).order_by("-fechaModificacion")
            #palabra = Palabra.objects.filter(idioma=idioma,usuario=user
            #                    ).exclude(dificultad__in=(0,4,5)
            #                    ).order_by("-fechaModificacion")
        
        serializers = PalabrasSerializer(palabra, many=True)
        return Response(serializers.data)
    except Exception as e: 
       
        Response({'palabra':[]})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBuscarTraduccion(request):
    user=request.user
    palabra=request.query_params.get('palabra')
    print(palabra)

    try:
        respuesta=Palabra.objects.filter(palabra=palabra, usuario=user).first()
        if respuesta==None:
            respuesta=Palabra.objects.filter(palabra__contains=palabra, usuario=user).first()
        serializers = PalabrasSerializer(respuesta, many=False)
        return Response(serializers.data)
    except ObjectDoesNotExist:
        Response({'traduccion':[]})