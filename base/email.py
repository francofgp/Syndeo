""" Acá se configurar todos los html, para darle formato a los emails 

Se crea un template en html, en la carpeta de backend/template, 
con los siguientes nombres

https://github.com/sunscrapers/djoser/tree/master/djoser/templates/email

luego se crea una clase para cada uno: como abajo
y se debe agregar en el setting.py que usamos un html custom, en el DJOSER,
por ejemplo así
'EMAIL': {
            'activation': 'base.email.ActivationEmail',
            'confirmation': 'base.email.ConfirmationEmail'
    }
}

ver stackoverflow para mas info
https://stackoverflow.com/questions/63439174/djoser-override-activation-email-with-template

"""
from djoser import email

class ActivationEmail(email.ActivationEmail):
    template_name = 'activation.html'

class ConfirmationEmail(email.ConfirmationEmail):
    template_name = 'confirmation.html'
    
class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'resetPassword.html'

class PasswordChangedConfirmationEmail(email.PasswordChangedConfirmationEmail):
    template_name = 'resetPasswordConfirm.html'