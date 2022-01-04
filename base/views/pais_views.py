from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password #esto sirve para hashear la pass

from ..serializers import PaisSerializer

from ..models import Account
from ..models import Pais

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

User = Account


@api_view(['GET'])
#@permission_classes([IsAdminUser])
def getPaises(request):
    paises = Pais.objects.all()
    serializers = PaisSerializer(paises, many=True)
    return Response(serializers.data)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getPais(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    pais = Pais.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = PaisSerializer(pais, many=False)
    return Response(serializers.data)


@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def updatePais(request, pk):
    try:
        #pais = request.Pais
        pais = Pais.objects.get(id=pk)
        serializers = PaisSerializer(pais, many=False)

        data = request.data

        #product = Product.objects.get(_id=pk)
        pais.nombre = data['nombre']

        pais.save()

        return Response(serializers.data)
    except:
        message = {'detail': 'Campos inválidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerPais(request):
    data = request.data
 
    pais = Pais.objects.create(
        nombre=data['nombre'])

    serializer = PaisSerializer(pais, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
#@permission_classes([IsAdminUser])
def deletePais(request, pk):
    pais = Pais.objects.get(id=pk)
    pais.delete()
    return Response('Producted Deleted')

