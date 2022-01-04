from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password #esto sirve para hashear la pass

from ..serializers import IdiomasSerializer

from ..models import Account, Texto
from ..models import Idioma

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

User = Account

@api_view(['GET'])
#@permission_classes([IsAdminUser])
def getIdiomas(request):
    idiomas = Idioma.objects.all()
    serializers = IdiomasSerializer(idiomas, many=True)
    return Response(serializers.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getIdiomasUser(request):
    user=request.user
    idiomas_del_user=Texto.objects.filter(usuario=user).order_by().values('idioma').distinct()

    idiomas=[]
    for idioma in idiomas_del_user:
        idiomas.append(idioma['idioma']) 

    idiomas=tuple(idiomas)

    idiomas_del_user=Idioma.objects.filter(id__in=idiomas)   
    serializers = IdiomasSerializer(idiomas_del_user, many=True)
    return Response(serializers.data)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getIdioma(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    idioma = Idioma.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = IdiomasSerializer(idioma, many=False)
    return Response(serializers.data)


@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def updateIdioma(request, pk):

    try:
        #pais = request.Pais
        idioma = Idioma.objects.get(id=pk)
        serializers = IdiomasSerializer(idioma, many=False)

        data = request.data

        #product = Product.objects.get(_id=pk)
        idioma.name = data['name']

        idioma.save()

        return Response(serializers.data)
    except:
        message = {'detail': 'Campos inválidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerIdioma(request):
    data = request.data

    idioma = Idioma.objects.create(name=data['name'])

    serializer = IdiomasSerializer(idioma, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
# @permission_classes([IsAdminUser])
def deleteIdioma(request, pk):
    idioma = Idioma.objects.get(id=pk)
    idioma.delete()
    return Response('Categoria Deleted')
