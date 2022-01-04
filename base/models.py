from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill    
from simple_history.models import HistoricalRecords

class MyAccountManager(BaseUserManager):
    def create_user(self, email, username,first_name,sexo,fecha_nacimiento,idioma,pais, last_name,password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')
        if not sexo:
            raise ValueError('Users must have a sexo')
        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        user.pais=pais
        user.last_name=last_name
        user.first_name=first_name
        user.fecha_nacimiento=fecha_nacimiento
        user.idioma=idioma
        user.sexo=sexo
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            username=username,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Pais(models.Model):
    name = models.CharField(max_length=30, null=True)

    def __str__(self):
        return self.name


class Idioma(models.Model):
    name = models.CharField(max_length=30, null=True)

    def __str__(self):
        return self.name


class Account(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    pais = models.CharField(max_length=30, null=True, blank=True)
    idioma = models.ForeignKey(Idioma, on_delete=models.CASCADE, null=True)
    date_joined = models.DateTimeField( verbose_name='date_joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last_login', auto_now=True)
    sexo = models.CharField(max_length=30, null=True, blank=True)
    descripcion = models.CharField(max_length=100, null=True, blank=True, default="")
    # formato   2021-06-23   - YYYY-MM-DD
    fecha_nacimiento = models.DateField(blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    imagenPerfil = models.ImageField(null=True, blank=True, default="images/default_user.png", upload_to='images/')
    #perfilThumbnail = ImageSpecField(source='imagenPerfil', processors=[ ResizeToFill(100, 50)], format='JPEG', options={'quality': 60})
    imagenPortada = models.ImageField(null=True, blank=True, default="images/default_portada.jpg", upload_to='images/')
    #portadaThumbnail = ImageSpecField(source='imagenPortada', processors=[ResizeToFill(100, 50)], format='JPEG', options={'quality': 70})

    descripcion = models.TextField(null=True, blank=True)
    metaDiaria = models.BigIntegerField(null=True, default=10)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','sexo',"fecha_nacimiento","idioma","first_name","last_name","pais"]

    objects = MyAccountManager()

    def __str__(self):
        return self.email

    # For checking permissions. to keep it simple all admin have ALL permissons
    def has_perm(self, perm, obj=None):
        return self.is_admin

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(self, app_label):
        return True

        


class Categoria(models.Model):
    nombre = models.CharField(max_length=30, null=True)
    usuario = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True)
    descripcion = models.TextField(max_length=100000, null=True, blank=True)
    def __str__(self):
        return self.nombre

class Desafios(models.Model):
    #dificultad = models.BigIntegerField(null=True)
    nombre = models.CharField(max_length=30, null=True)
    cantidadPalabras = models.BigIntegerField(null=True)
    cantidadPalabrasLeidas = models.BigIntegerField(null=True)
    fechaFinalizacion = models.DateField(null=True)
    fechaCreacion = models.DateField(null=True, auto_now_add=True, blank=True)
    usuario = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)
    imagen = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.nombre


class Texto(models.Model):
    nombre = models.CharField(max_length=30, null=True)
    usuario = models.ForeignKey( Account, on_delete=models.CASCADE, null=True, related_name="textos")
    fechaCreacion = models.DateField(null=True, auto_now_add=True)
    fechaModificacion = models.DateField(null=True, auto_now=True, blank=True)
    categoria = models.ForeignKey( Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    cantidadPalabras = models.BigIntegerField(null=True, blank=True)
    texto = models.TextField(max_length=100000, null=True, blank=True)
    audio = models.FileField(null=True, blank=True)
    youtubeURL = models.URLField(max_length=100, null=True)
    imagen = models.ImageField(null=True, blank=True,default="images/default_libro.png", upload_to='images/')
    #imagenThumbnail = ImageSpecField(source='imagen', processors=[ ResizeToFill(200, 150)], format='JPEG', options={'quality': 90})
    completado = models.BooleanField(null=True, blank=True, default=False)
    fechaUltimaLectura = models.DateField(null=True, auto_now=True, blank=True)
    fechaCompletado = models.DateField(null=True, blank=True)
    idioma = models.ForeignKey(Idioma, on_delete=models.CASCADE, null=True)
    autor = models.CharField(max_length=30, null=True , default="", blank=True )

    def __str__(self):
        return self.nombre

class Palabra(models.Model):
    palabra = models.CharField(max_length=30, null=True, blank=True)
    fechaCreacion = models.DateField(null=True, auto_now_add=True)
    fechaUltimoRepaso = models.DateField(null=True, blank=True)
    fechaSiguienteRepaso = models.DateField(null=True, blank=True)
    fechaModificacion = models.DateField(null=True, blank=True, auto_now=True)
    traduccion = models.CharField(max_length=100, null=True, blank=True)
    idioma = models.ForeignKey(Idioma, on_delete=models.CASCADE, null=True)
    cantidadRepasos = models.PositiveIntegerField(null=True, blank=True, default=0)
    cantidadDeRepasosHastaElProximoNivel = models.BigIntegerField( null=True, blank=True,default=0)
    fechaHastaDescenderNivel = models.DateField(null=True, blank=True)
    dificultad = models.PositiveIntegerField(null=True, blank=True, default=0)
    DiasAAgregarSiCorrecto = models.PositiveIntegerField(null=True, blank=True)
    fechaLeidaPrimeraVez = models.DateField(null=True, blank=True)
    texto = models.ManyToManyField(Texto)
    usuario = models.ForeignKey( Account, on_delete=models.CASCADE, null=True, blank=True)
    esFrase= models.BooleanField(default=False, blank=True,null=True)
    historial = HistoricalRecords()

    def __str__(self):
        return self.palabra
