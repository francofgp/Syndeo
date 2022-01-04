from rest_framework import serializers
from .models import Account
from .models import Pais
from .models import Idioma
from .models import Categoria
from .models import Desafios
from .models import Texto
from .models import Palabra
from rest_framework_simplejwt.tokens import RefreshToken
""" from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer

class UserRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = ('id', "username",'email', 'name', 'pais', 'sexo', 'password',"apellido","fechaNacimiento" )
 """

User = Account

# https://www.django-rest-framework.org/tutorial/1-serialization/#using-modelserializers


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    isActive = serializers.SerializerMethodField(read_only=True)
    #miniaturaPerfil = serializers.SerializerMethodField(read_only=True)
    #minuaturaPortada = serializers.SerializerMethodField(
    #    'get_miniaturaPortada')
    # pais = serializers.SlugRelatedField( many=False, read_only=True, slug_field='name')

    idioma = serializers.SlugRelatedField(
        many=False, read_only=True, slug_field='name')

    class Meta:
        model = User
        fields = ["id", "_id", "username", "email", 'name', "isAdmin", "pais", "idioma", "sexo", "last_name", "descripcion",
                  "imagenPerfil", "imagenPortada",  "fecha_nacimiento", "metaDiaria","isActive"]
        # fields = '__all__'
        # la info id username email vienen por default no hay que serializarlas pero si quiero mas info debo hacer
        # los metodos de abajo
        # https://docs.djangoproject.com/en/3.1/topics/auth/default/

    def get__id(self, obj):
        return obj.id

    # def get_miniaturaPerfil(self, obj):
    #    return obj.perfilThumbnail.url

    # def get_miniaturaPortada(self, obj):
    #    return obj.portadaThumbnail.url

    def get_isAdmin(self, obj):
        return obj.is_staff
    def get_isActive(self, obj):
        return obj.is_active

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "_id", "username", "email",
                  'name', "isAdmin", "token", "pais", "idioma","is_active"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class PaisSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pais
        fields = '__all__'


class IdiomasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Idioma
        fields = '__all__'


class CategoriasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Categoria
        fields = '__all__'


class DesafiosSerializer(serializers.ModelSerializer):

    usuario = serializers.SlugRelatedField(
        many=False, read_only=True, slug_field='username')

    class Meta:
        model = Desafios
        fields = '__all__'


class TextosSerializer(serializers.ModelSerializer):
    #miniaturaImagen = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Texto
        fields = '__all__'
        
    # def get_miniaturaImagen(self, obj):
    #    return obj.imagenThumbnail.url


class TextosYPalabrasSerializer(serializers.ModelSerializer):

    palabras = serializers.SerializerMethodField(read_only=True)
    idioma_objeto = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Texto
        fields = '__all__'

    def get_palabras(self, obj):
        palabra = obj.palabra_set.all()
        serializer = PalabrasReducidoSerializer(palabra, many=True)
        return serializer.data

    def get_idioma_objeto(self, obj):
        serializer = IdiomasSerializer(obj.idioma, many=False)
        return serializer.data


class PalabrasReducidoSerializer(serializers.ModelSerializer):

    idioma_objeto = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Palabra
        fields = ["id", "palabra", "idioma_objeto",
                  "dificultad", "idioma", "texto"]

    def get_idioma_objeto(self, obj):
        serializer = IdiomasSerializer(obj.idioma, many=False)
        return serializer.data


class PalabrasSerializer(serializers.ModelSerializer):

    idioma_objeto = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Palabra
        fields = '__all__'

    def get_idioma_objeto(self, obj):
        serializer = IdiomasSerializer(obj.idioma, many=False)
        return serializer.data

class PalabrasSerializerReducido(serializers.ModelSerializer):

    idioma_objeto = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Palabra
        fields = ["id", "palabra", "idioma_objeto",
                  "dificultad", "idioma", "fechaLeidaPrimeraVez","texto"]

    def get_idioma_objeto(self, obj):
        serializer = IdiomasSerializer(obj.idioma, many=False)
        return serializer.data
