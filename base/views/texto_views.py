import time
from django.shortcuts import render
from django.http import JsonResponse
# esto sirve para hashear la pass
from django.contrib.auth.hashers import make_password
import requests
import datetime
from datetime import date

from ..serializers import TextosSerializer, TextosYPalabrasSerializer
import re
from ..models import Account, Palabra
from ..models import Texto

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from django.core.files.base import ContentFile
import json
from ibm_watson import LanguageTranslatorV3
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.db.models import Q

from datetime import datetime

from django.db import connection

User = Account


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getTextos(request):
    # user = request.user
    # print(user)
    # textos = user.textos.all()
    print("asda")
    textos = Texto.objects.all()
    serializers = TextosSerializer(textos, many=True)
    return Response(serializers.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getTexto(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    textos = Texto.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = TextosYPalabrasSerializer(textos, many=False)
    return Response(serializers.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getTextoMejorado(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    #textos = Texto.objects.get(id=pk)
    # vamos a usar el token para gestionar los usuarios
    #serializers = TextosYPalabrasSerializer(textos, many=False)
    texto = Texto.objects.get(id=pk)

    #palabrasDelTexto = re.sub(r'[^\w\'\-]', ' ', texto.texto)
    #palabrasDelTexto = " ".join(texto.texto.split())
    parrafo = texto.texto
    parrafo = parrafo.replace("\n \n", "\n")
    parrafo = parrafo.replace("\n\n", "\n")
    palabrasDelTexto = re.sub(' +', ' ', parrafo).replace('.', '. ', parrafo.count(
        '.')).replace(',', ', ', parrafo.count(',')).replace('/', '/ ', parrafo.count('/'))
    #palabrasDelTexto = palabrasDelTexto.split(" ")

    #palabras = re.sub(r'[^\w\'\-]', ' ', texto.texto.lower())
    #palabras = palabras.split(" ")
    # palabras = [palabra for palabra in palabras if palabra !=
    #                "" and palabra != "'"]
    # print(palabras)
    # print(palabrasDelTexto)

    palabrasDelTexto = re.findall(r'\S+|\n', palabrasDelTexto)
    for i in range(len(palabrasDelTexto)-2, -1, -1):
        if palabrasDelTexto[i+1] == '\n':
            palabrasDelTexto[i] = palabrasDelTexto[i] + \
                palabrasDelTexto.pop(i+1)
    dictionarioDePalabras = []
    for palabra in palabrasDelTexto:
        # print(palabra)
        palabraOriginal = palabra
        palabra = re.sub(r'[^\w\'\-]', ' ', palabra.lower())
        try:

            salto = False
            if palabraOriginal[-1:] == "\n":
                salto = True
            pal = Palabra.objects.get(palabra=palabra.strip(
            ), usuario=texto.usuario, texto=texto)  # ,texto=texto.id

            dictionarioDePalabras.append(dict({
                "id": pal.id,
                "palabra": pal.palabra,
                "palabraOriginal": palabraOriginal,
                "salto": salto,
                "dificultad": pal.dificultad,
                "idioma": pal.idioma.id,
                "traduccion": pal.traduccion


            }))

        except Exception:

            salto = False
            if palabraOriginal[-1:] == "\n":
                salto = True

            dictionarioDePalabras.append(dict({
                "id": None,
                "palabra": palabraOriginal,
                "palabraOriginal": palabraOriginal,
                "salto": salto,
                "dificultad": 4,
                "idioma": None,


            }))
            print(Exception)
    audio = ""
    try:
        audio = texto.audio.url  # do your thing when user.user_info exists
    except Exception:  # Be explicit with catching exceptions.
        pass
    respuesta = {
        "id": texto.id,
        "palabras": dictionarioDePalabras,
        "idioma_objeto": {
            "id": texto.idioma.id,
            "name": texto.idioma.name
        },
        "nombre": texto.nombre,
        "fechaCreacion": texto.fechaCreacion,
        "fechaModificacion": texto.fechaModificacion,
        "cantidadPalabras": texto.cantidadPalabras,
        "texto": texto.texto,
        "audio": audio,
        "youtubeURL": texto.youtubeURL,
        "imagen": texto.imagen.url,
        "completado": texto.completado,
        "fechaUltimaLectura": texto.fechaUltimaLectura,
        "fechaCompletado": texto.fechaCompletado,
        "autor": texto.autor,
        "usuario": texto.usuario.id,
        "categoria": texto.categoria.id,
        "idioma": texto.idioma.id
    }
    return Response(respuesta)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTextoUsuario(request, pk):
    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    textos = Texto.objects.filter(usuario=pk)
    # vamos a usar el token para gestionar los usuarios
    serializers = TextosSerializer(textos, many=True)
    return Response(serializers.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBuscarTexto(request):

    # Esto es para instalar en el postgres esta extension si no existe
    # de fabrica nunca existe, se podria usar un signal pre_migrate
    # como acá: https://stackoverflow.com/questions/41940148/how-to-set-up-postgres-database-with-pytest-django
    # pero no conseguí que ande, asi que lo hago acá,
    # con esto ejecuto una SQL query cruda
    with connection.cursor() as cursor:
        cursor.execute('CREATE EXTENSION IF NOT EXISTS pg_trgm')

    user = request.user
    query = request.query_params.get('query')
    search_vector = SearchVector("nombre", weight='A') + SearchVector("texto", weight='C') + \
        SearchVector("idioma__name", weight='B') + \
        SearchVector("categoria__nombre", weight='B')
    search_query = SearchQuery(query)

    textos = Texto.objects.annotate(
        rank=SearchRank(search_vector, search_query),
        similarity=TrigramSimilarity('nombre', query) + TrigramSimilarity(
            'idioma__name', query) + TrigramSimilarity('categoria__nombre', query),
    ).filter(Q(rank__gte=0.2) | Q(similarity__gt=0.1)).filter(usuario=user).order_by('-similarity')

    # aca se hace esto ya que no usamos el sistema de django para el manejo de usuarios
    #textos = Texto.objects.filter(usuario=user)
    # vamos a usar el token para gestionar los usuarios

    serializers = TextosSerializer(textos, many=True)
    return Response(serializers.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registerTextos(request):

    print(request.data)

    data = request.data

    # cantidad de palabras calcular con esto len(re.findall(r'\w+', "hola soy del campo"))
    texto = Texto(


        usuario_id=data['usuario'],
        nombre=data['nombre'],
        fechaCreacion=data['fechaCreacion'],
        fechaModificacion=data['fechaModificacion'],
        categoria_id=data['categoria'],
        cantidadPalabras=data['cantidadPalabras'],
        texto=data['texto'].replace("’", "'"),
        youtubeURL=data['youtubeURL'],
        autor=data['autor'],

        # completado=data['completado'],
        # fechaUltimaLectura=data['fechaUltimaLectura'],
        # fechaCompletado=data['fechaCompletado'],
        idioma_id=data['idioma'],

    )
    formato_imagen = ('.png', '.jpg', '.jpeg', '.webp')
    formato_audio = ('.mp3', '.aac', '.wav', '.ogg')

    if request.FILES.get('image') != None:
        try:
            if request.FILES.get('image').name.lower().endswith(formato_imagen):
                texto.imagen = request.FILES.get('image')
            else:
                raise Exception
        except Exception:
            message = {'detail': 'Formato de imagen inválido'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    if request.FILES.get('audio') != None:
        try:
            if request.FILES.get('audio').name.lower().endswith(formato_audio):
                texto.audio = request.FILES.get('audio')
            else:
                raise Exception
        except Exception:
            message = {'detail': 'Formato de audio inválido'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    try:
        if data['checkBoxAI'] == 'true':
            diccionario_voces_IBM = {
                "Portugues": "pt-BR_IsabelaV3Voice",
                "Español": "es-LA_SofiaV3Voice",
                "Inglés": "en-US_AllisonV3Voice",
                "Holandés": "nl-NL_EmmaVoice",
                "Francés": "fr-FR_NicolasV3Voice",
                "Alemán": "de-DE_BirgitV3Voice",
                "Italiano": "it-IT_FrancescaV3Voice",
                "Árabe": "ar-MS_OmarVoice"
            }

            # Me logeo
            # To add watson translation add a value api key here
            apikey = "My secret key"  # change here

            authenticator = IAMAuthenticator(f'{apikey}')

            text_to_speech = TextToSpeechV1(
                authenticator=authenticator
            )

            text_to_speech.set_service_url(
                'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/945c462b-a565-48da-983d-0f48d8d53162')

            media = text_to_speech.synthesize(
                data['texto'][0:100],
                voice=diccionario_voces_IBM[texto.idioma.name],
                accept='audio/wav'
            ).get_result().content

            nombre_audio = f"{texto.id}.wav"
            texto.save()
            texto.audio.save(nombre_audio, ContentFile(media))

        else:
            texto.save()

        serializer = TextosSerializer(texto, many=False)
        return Response(serializer.data)

    except Exception:
        message = {
            'detail': 'Error al intentar generar el audio, por favor revise su conexión a internet.'}
        if(texto.idioma.name == "Ruso"):
            message = {'detail': 'Idioma no soportado por Syndeo AI'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteTexto(request, pk):
    texto = Texto.objects.get(id=pk)
    texto.delete()
    return Response('Producted Deleted')


@api_view(['POST'])
def uploadImageTexto(request):
    data = request.data
    print(data)
    texto_id = data['id']
    texto = Texto.objects.get(id=texto_id)
    texto.imagen = request.FILES.get('image')
    texto.save()
    return Response('Imagen actualizada con exito')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateTexto(request, pk):

    print(date.today())

    try:
        texto = Texto.objects.get(id=pk)
        serializers = TextosSerializer(texto, many=False)

        data = request.data
        cantidad_de_palabras = len(data['texto'].split())
        texto.nombre = data['nombre']
        texto.idioma_id = data['idioma']
        texto.youtubeURL = data["youtubeURL"]
        texto.texto = data['texto'].replace("’", "'")
        texto.cantidadPalabras = cantidad_de_palabras
        texto.categoria_id = data["categoria"]
        texto.fechaModificacion = date.today()
        texto.autor = data["autor"]

        formato_imagen = ('.png', '.jpg', '.jpeg', '.webp')
        formato_audio = ('.mp3', '.aac', '.wav', '.ogg')

        if request.FILES.get('image') != None:
            try:
                if request.FILES.get('image').name.lower().endswith(formato_imagen):
                    texto.imagen = request.FILES.get('image')
                else:
                    raise Exception
            except Exception:
                message = {'detail': 'Formato de imagen inválido'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)

        if request.FILES.get('audio') != None:
            try:
                if request.FILES.get('audio').name.lower().endswith(formato_audio):
                    texto.audio = request.FILES.get('audio')
                else:
                    raise Exception
            except Exception:
                message = {'detail': 'Formato de audio inválido'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)

        try:
            if data['checkBoxAI'] == 'true':
                diccionario_voces_IBM = {
                    "Portugues": "pt-BR_IsabelaV3Voice",
                    "Español": "es-LA_SofiaV3Voice",
                    "Inglés": "en-US_AllisonV3Voice",
                    "Holandés": "nl-NL_EmmaVoice",
                    "Francés": "fr-FR_NicolasV3Voice",
                    "Alemán": "de-DE_BirgitV3Voice",
                    "Italiano": "it-IT_FrancescaV3Voice",
                    "Árabe": "ar-MS_OmarVoice"
                }

                # Me logeo
                # To add watson translation add a value api key here
                apikey = "My secret key"  # change here

                authenticator = IAMAuthenticator(f'{apikey}')
                text_to_speech = TextToSpeechV1(
                    authenticator=authenticator
                )

                text_to_speech.set_service_url(
                    'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/945c462b-a565-48da-983d-0f48d8d53162')

                media = text_to_speech.synthesize(
                    data['texto'][0:100],
                    voice=diccionario_voces_IBM[texto.idioma.name],
                    accept='audio/wav'
                ).get_result().content

                nombre_audio = f"{texto.id}.wav"
                texto.save()
                texto.audio.save(nombre_audio, ContentFile(media))

            else:
                texto.save()

            serializer = TextosSerializer(texto, many=False)
            return Response(serializer.data)

        except Exception as e:
            message = {
                'detail': 'Error al intentar generar el audio, por favor revise su conexión a internet.'}
            if(texto.idioma.name == "Ruso"):
                message = {'detail': 'Idioma no soportado por Syndeo AI'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    except:
        message = {'detail': 'Campos inválidos'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getTraduccion(request):
    idioma_base = request.query_params.get('from')
    idioma_objetivo = request.query_params.get('to')
    texto = request.query_params.get('texto')

    # lista de idioma disponibles https://cloud.ibm.com/docs/language-translator?topic=language-translator-translation-models

    idiomas_disponibles = {
        "Portugues": "pt",
        "Español": "es",
        "Inglés": "en",
        "Holandés": "nl",
        "Francés": "fr",
        "Alemán": "de",
        "Italiano": "it",
        "Árabe": "ar",
        "Ruso": "ru",
        "Rumano": "ro",
        "Griego": "el",
        "Polaco": "pl",
        "Húngaro": "hu",
        "Ucraniano": "uk",
        "Checo": "cs",
        "Croata": "hr",
        "Estonio": "et",
        "Serbio": "sr",
        "Eslovaco": "sk",
        "Finés": "fi",
        "Sueco": "sv",
        "Esloveno": "sl"
    }
    codigo_idioma_base = idiomas_disponibles[idioma_base]
    codigo_idioma_objetivo = idiomas_disponibles[idioma_objetivo]
    print(idioma_base, idioma_objetivo, texto)

    # To add watson translation add a value api key here
    apikey = "My secret key"  # change here

    authenticator = IAMAuthenticator(f'{apikey}')
    language_translator = LanguageTranslatorV3(
        version='2018-05-01',
        authenticator=authenticator
    )
    url = "https://api.us-south.language-translator.watson.cloud.ibm.com"

    language_translator.set_service_url(f'{url}')

    translation = language_translator.translate(
        text=texto,
        source=codigo_idioma_base,
        target=codigo_idioma_objetivo
    ).get_result()
    #print(json.dumps(translation, indent=2, ensure_ascii=False))
    return Response(translation, status=status.HTTP_200_OK)


"""     attempt_num = 0  # keep track of how many times we've retried
    while attempt_num < 5:
        url = 'www.apiexternal.com/endpoint'
        payload = {'Token':'My_Secret_Token','product':'product_select_in_form','price':'price_selected_in_form'}
        response = requests.post(url, data = payload)
        if r.status_code == 200:
            data = r.json()
            return Response(data, status=status.HTTP_200_OK)
        else:
            attempt_num += 1
            # You can probably use a logger to log the error here
            time.sleep(5)  # Wait for 5 seconds before re-trying
    return Response({"error": "Request failed"}, status=r.status_code)
else:
    return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST) """


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def marcarComoLeido(request, pk):
    user = request.user
    print(user)
    try:
        texto = Texto.objects.get(id=pk)
        #pais = request.Pais
        if(texto.completado == False):
            texto.fechaCompletado = datetime.now()
            texto.completado = True
        texto.fechaUltimaLectura = datetime.now()

        palabras = texto.palabra_set.all()
        for palabra in palabras:
            if palabra.dificultad == 0:
                palabra.dificultad = 4
                palabra.fechaLeidaPrimeraVez = datetime.now()
                palabra.DiasAAgregarSiCorrecto = 0
                palabra.save()
        texto.save()
        serializers = TextosYPalabrasSerializer(texto, many=False)
        return Response(serializers.data)

    except:
        message = {'detail': 'Error al actualizar como leido'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def checkTexto(request):
    texto = Texto.objects.filter(id=request.GET.get(
        "textoID"), usuario=request.GET.get("userID"))
    if not texto:
        return Response(False)
    else:
        return Response(True)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def setFechaUltimaLectura(request, pk):
    texto = Texto.objects.get(id=pk)
    texto.fechaUltimaLectura = date.today()
    serializer = TextosSerializer(texto, many=False)
    return Response(serializer.data)
