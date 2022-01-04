from django.shortcuts import render
from django.http import JsonResponse
# esto sirve para hashear la pass
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _

from ..serializers import UserSerializer, UserSerializerWithToken

from ..models import Account, Idioma

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
import time, datetime
User = Account


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    default_error_messages = {
        'no_active_account': _('Credenciales invalidas')
    }
    
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    print(data)

    try:
        idioma_nativo = Idioma.objects.get(pk=data['idioma'])
    except:
        message = {'detail': 'Campos Idiomas'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.create(

            first_name=data['name'],
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),  # aca hasheo la pass
            pais=data['pais'],
            fecha_nacimiento=data['fechaNacimiento'][:10],
            sexo=data['sexo'],
            last_name=data['apellido']

        )
        user.idioma = idioma_nativo
        user.save()
        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data)
    except Exception:
        if Account.objects.filter(username=data['username']).exists() == True:
            message = {'detail': 'Error: pruebe con otro usuario.'}
        elif Account.objects.filter(email=data['email']).exists() == True:
            message = {'detail': 'Error: pruebe con otro email.'}
        else:
            message = {'detail': 'Campos no válidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    '''
        message = {'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
'''
# aca lo que hago es transformar la info de la DB en un json utilizando un serializador


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    user = request.user
    # vamos a usar el token para gestionar los usuarios
    serializers = UserSerializer(user, many=False)
    return Response(serializers.data)


@api_view(['GET'])
# @permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializers = UserSerializer(users, many=True)
    return Response(serializers.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):

    print(request.data['descripcion'])

    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    user = request.user
    # vamos a usar el token para gestionar los usuarios
    # usamos withtoken para generar un nuevo token
    serializers = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['username']
    user.email = data['email']
    user.pais = data['pais']
    user.idioma_id = data['idioma']
    user.fecha_nacimiento = data['fechaNacimiento'][:10]
    user.metaDiaria = data['metaDiaria']
    user.sexo = data['sexo']
    user.descripcion = data['descripcion']
    user.last_name = data['apellido']

    if data['password'] != '':
        user.password = make_password(data['password'])  # ver esto

    user.save()
    return Response(serializers.data)


@api_view(['POST'])
def uploadImagePerfil(request):
    data = request.data
    user_id = data['id']
    user = User.objects.get(id=user_id)
    imageName=f"perfil:{user.username}:{user_id}:"
    imageName=imageName+f'{datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}'
    user.imagenPerfil = request.FILES.get('imagePerfil')
    user.imagenPerfil.name=imageName
    user.save()
    return Response('Imagen actualizada con exito')


@api_view(['POST'])
def uploadImagePortada(request):
    data = request.data
    user_id = data['id']
    user = User.objects.get(id=user_id)
    user.imagenPortada = request.FILES.get('image')
    imageName=f"portada:{user.username}{user_id}:"
    imageName=imageName+imageName+f'{datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}'
    user.imagenPortada = request.FILES.get('image')
    user.imagenPortada.name=imageName
    user.save()
    return Response('Imagen de portada actualizada con exito')
