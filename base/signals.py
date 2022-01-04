from django.db.models.signals import pre_save, post_save, pre_delete, post_delete
from .models import Account, Texto, Palabra, Categoria
import re
User = Account


def creacionDeCategoriaPorDefecto(sender, instance, created, **kwargs):
    """ Funcion para que cuando creas un nuevo usuario/registro se cree
    una categoria base """
    if created:
        usuario = instance
        categoria = Categoria.objects.create(
                    usuario=usuario,
                    nombre="Base",
                )

    pass

def updateUser(sender, instance, **kwargs):
    user = instance
    # Me parece que esta señal no hace falta
    # if user.email != '' :
    #    user.username = user.email


def creacionPalabras(sender, instance, created, **kwargs):
    # created es un atributo que tiene todo objeto por defecto para saber si es la
    # primera vez que se crea o no
    if created:
        texto = instance

        # 1: Remuevo los carácteres especiales menos la "'" y el guion "-" comilla simple para cosas como
        # en ingles  "i'am" o en frances "Qu'est-ce que c'est"
        # esta RE va a remover todos los carácteres especiales como los simbolos !"#$%&"
        # pero cosas como Åå, Ää, Öö me las va a dejar,
        # Ejmeplo #
        # re.sub(r'[^\w\']',' ', "hol 2 12 #!# 22 ## $! ' ' ' 'ma i'm i don't  ылов цшщш  ШВОЩЙ Ы  资 料  集料料 料")
        # es igual a
        # "hol 2 12     22       ' ' ' 'ma i'm i don't  ылов цшщш  ШВОЩЙ Ы  资 料  集料料 料"
        palabras = re.sub(r'[^\w\'\-]', ' ', texto.texto.lower())
        palabras = palabras.split(" ")
        # cuando haga esto me pueden quedar cosas como
        # ['hol', '2', '12', '', '', '22', '', '', '', '', '', '', "'", "'", "'", "'ma", "i'm", 'i', "don't", '', 'ылов', 'цшщш', '', 'ШВОЩЙ', 'Ы', '', '资', '料', '', '集料料', '料']
        # esos '' lo tengo que eliminar, porque no me sirven de nada
        palabras = [palabra for palabra in palabras if palabra !=
                    "" and palabra != "'"]

        # 2: loopeo cada palabra y la creo sino existe
        for palabra in palabras:
            # 3: me fijo si existe la palabra antes de crearla
            # sino existe la creo y si existe la agrego a otro texto si es diferente sino,no

            # esto devuelve la palabra si es que existe, sino es [] solamente,
            # es un array, osea que tenemos que agregarle [0] para agarrar el primer elemento
            # se le puede agregar al final    ".exists()" y devuelve true or false
            # pero si existe tendria que hacer otra query para vincular otro texto

            # me fijo si la palabra existe para cierto idioma y para cierto usuario
            existe = Palabra.objects.filter(
                idioma=texto.idioma, palabra=palabra, usuario=texto.usuario)
            # si no existe la creo
            if not existe:

                word = Palabra.objects.create(
                    palabra=palabra,
                    idioma=texto.idioma,
                    usuario=texto.usuario
                )
                # hay que crear el objeto y DESPUES asociar con el texto
                word.texto.add(texto)
                word.save()
            # si  no existe esa palabra para el idioma especifico y el usuario,
            # relaciono esa palabra con el texto
            else:
                existe[0].texto.add(texto)
                existe[0].save()
    else:

        # Arriba pregunto si se crea por primera vez, si no es así actualizo
        texto = instance
        #obtengo todas las palabras del texto
        palabras = texto.palabra_set.all()

        # loopeo cada palabra para ir removiendo el texto
        for palabra in palabras:
            if  not palabra.esFrase:
                palabra.texto.remove(texto)
                palabra.save()


        
        # Hasta acá removí todas las palabras vinculadas al texto que se guardo, ahora
        # necesito hacer lo mismo que hice arriba

        palabras = re.sub(r'[^\w\'\-]', ' ', texto.texto.lower())
        palabras = palabras.split(" ")
        palabras = [palabra for palabra in palabras if palabra !=
                    "" and palabra != "'"]

        for palabra in palabras:
            existe = Palabra.objects.filter(
            idioma=texto.idioma, palabra=palabra, usuario=texto.usuario)

            if not existe:

                word = Palabra.objects.create(
                    palabra=palabra,
                    idioma=texto.idioma,
                    usuario=texto.usuario
                )
                word.texto.add(texto)
                word.save()

            else:
                existe[0].texto.add(texto)
                existe[0].save()

        ###limpiando palabras sueltas
        todas_las_palabras_del_usuario=Palabra.objects.filter(usuario=texto.usuario)
        for palabra in todas_las_palabras_del_usuario:
            if len(palabra.texto.all())==0:
                #print(f"Eliminando: {palabra.palabra}")
                palabra.delete()
                

def eliminacionTexto(sender, instance, **kwargs):
    texto = instance
    todas_las_palabras_del_texto=Palabra.objects.filter(texto=texto.id)    
    #print(todas_las_palabras_del_texto)    
    for palabra in todas_las_palabras_del_texto:
        palabra.texto.remove(texto)
        palabra.save()

    for palabra in todas_las_palabras_del_texto:
        if len(palabra.texto.all()) == 0:   
            palabra.delete() 
    
def eliminacionCategoria(sender, instance, **kwargs):
    categoria = instance    
    todas_los_textos_de_la_categoria=Texto.objects.filter(categoria__isnull=True) 
    categoria_base = Categoria.objects.get(nombre="Base",usuario=categoria.usuario) 
    for texto2 in todas_los_textos_de_la_categoria:
        texto2.categoria = categoria_base
        texto2.save()
   
pre_save.connect(updateUser, sender=User)
post_save.connect(creacionPalabras, sender=Texto)
post_save.connect(creacionDeCategoriaPorDefecto,sender=User)
pre_delete.connect(eliminacionTexto,sender=Texto)
post_delete.connect(eliminacionCategoria,sender=Categoria)