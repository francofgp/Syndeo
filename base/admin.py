from django.contrib import admin
from .models import *
# Register your models here.
from imagekit.admin import AdminThumbnail


""" class AccountAdmin(admin.ModelAdmin):
    # tambien se puede pasar una lista para que te muestre ciertos datos y no todos
    list_display = [field.attname for field in Account._meta.fields]
    readonly_fields = ('date_joined', 'last_login')
    list_display = ('__str__', 'admin_thumbnail')
    admin_thumbnail = AdminThumbnail(image_field='perfilThumbnail')

 """
""" class TextoAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'imagenThumbnail')
    readonly_fields = ('fechaCreacion', 'fechaModificacion')
    imagenThumbnail = AdminThumbnail(image_field='imagenThumbnail') """


#admin.site.register(Account, AccountAdmin)

admin.site.register(Account)
admin.site.register(Pais)
admin.site.register(Idioma)
admin.site.register(Categoria)
admin.site.register(Desafios)
#admin.site.register(Texto, TextoAdmin)
admin.site.register(Texto)
admin.site.register(Palabra)
