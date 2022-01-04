from django.urls import path
from ..views import user_views as views

urlpatterns = [ 
    path('',views.getUsers),  
    path('register/', views.registerUser), 
    path('profile/',views.getUserProfile),     
    path('profile/update/',views.updateUserProfile),      
    path('profile/update/imageprofile',views.uploadImagePerfil), 
    path('profile/update/imagecover',views.uploadImagePortada), 
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),         
]