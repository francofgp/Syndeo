from django.shortcuts import render
from django.http import JsonResponse

from ..serializers import CategoriasSerializer

from ..models import Categoria, Account

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

# @permission_classes([IsAdminUser])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCategorias(request):
    """ Para obtener las categorias de cada usuario """
    user = request.user
    categorias = Categoria.objects.filter(usuario=user)
    serializers = CategoriasSerializer(categorias, many=True)
    return Response(serializers.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getCategoria(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    categoria = Categoria.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = CategoriasSerializer(categoria, many=False)
    return Response(serializers.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCategoria(request, pk):
    print(request.data)

    try:
        #pais = request.Pais
        categoria = Categoria.objects.get(id=pk)
        serializers = CategoriasSerializer(categoria, many=False)

        data = request.data

        #product = Product.objects.get(_id=pk)
        if (data['nombre'] != ''):
            categoria.nombre = data['nombre']
        
        if (data['descripcion'] != ''):
            categoria.descripcion = data['descripcion']       

        categoria.save()

        return Response(serializers.data)
    except:
        message = {'detail': 'Campos inválidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registerCategoria(request):
    data = request.data
    user = Account.objects.get(id=data['usuario'])

    try:
        # Veo si existe la categoria
        existe = Categoria.objects.filter(nombre=data['nombre'],usuario=user).exists()

        if existe:
            raise Exception
        else:
            categoria = Categoria.objects.create(nombre=data['nombre'],usuario=user,descripcion=data['descripcion'])
            serializer = CategoriasSerializer(categoria, many=False)
            return Response(serializer.data)
    except:
        message = {'detail': 'Categoria ya existe'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCategoria(request, pk):
    categoria = Categoria.objects.get(id=pk)
    categoria.delete()
    return Response('Categoria Deleted')
