from django.apps import AppConfig

class BaseConfig(AppConfig):
    name = "base"   
    
    def ready(self):
        from . import signals # aca conecto signals
