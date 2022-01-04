from django.shortcuts import render
from django.http import JsonResponse
# esto sirve para hashear la pass
from django.contrib.auth.hashers import make_password

from ..serializers import DesafiosSerializer

from ..models import Desafios
from ..models import Account

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

User = Account


@api_view(['GET'])
# @permission_classes([IsAdminUser])
def getDesafios(request):
    desafios = Desafios.objects.all()
    serializers = DesafiosSerializer(desafios, many=True)
    return Response(serializers.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getDesafio(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    desafios = Desafios.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = DesafiosSerializer(desafios, many=False)
    return Response(serializers.data)


@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def updateDesafio(request, pk):

    try:
        #pais = request.Pais
        desafios = Desafios.objects.get(id=pk)
        serializers = DesafiosSerializer(desafios, many=False)

        data = request.data

        #product = Product.objects.get(_id=pk)
        desafios.nombre = data['nombre']
        desafios.cantidadPalabras = data['cantidadPalabras']
        desafios.cantidadPalabrasLeidas = data['cantidadPalabrasLeidas']
        desafios.imagen = data['imagen']

        desafios.save()

        return Response(serializers.data)
    except:
        message = {'detail': 'Campos inválidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerDesafio(request):
    data = request.data

    desafios = Desafios.objects.create(nombre=data['nombre'])

    serializer = DesafiosSerializer(desafios, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
# @permission_classes([IsAdminUser])
def deleteDesafio(request, pk):
    desafios = Desafios.objects.get(id=pk)
    desafios.delete()
    return Response('Categoria Deleted')
