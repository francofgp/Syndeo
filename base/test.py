
import requests
from rest_framework import status
from rest_framework.test import APITestCase


class TestCase(APITestCase):
     
    def test_get_all_languages(self):
        response = self.client.get('http://127.0.0.1:8000/api/idiomas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK) 

    def test_get_all_users_admin(self):
        auth_header = {
            'HTTP_AUTHORIZATION': 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM3MjY5NDY1LCJqdGkiOiJlNTAyMTEzOWEzZGY0NTk2YjEyNTZiYzdjNWRmZDQ3OSIsInVzZXJfaWQiOjF9.MWrWJBCxhuOyyVwiYhVC_rTn1GHOwR7NRUL6f9GhRAc",
        }
        response = self.client.get('http://127.0.0.1:8000/api/users/',headers=auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK) 

    def test_login_user(self):
        data= {"email":"giulianopertile@gmail.com",
                "password":"Hola123!"}
        request = requests.post("http://127.0.0.1:8000/api/users/login/", data = data)
        self.assertEqual(request.status_code, status.HTTP_200_OK) 

    def test_login_user_wrong_password(self):
        data= {"email":"giulianopertile@gmail.com",
                "password":"-------"}
        request = requests.post("http://127.0.0.1:8000/api/users/login/", data = data)
        self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED) 

    def test_get_languages_user(self):
        request=requests.get("http://127.0.0.1:8000/api/idiomas/idiomasuser/" ,headers={'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM3MjcxMDUzLCJqdGkiOiJiYTZlZTg5ODEzZjA0ZmRiOGRlNWQ1YjEyOWQ3NTRkYiIsInVzZXJfaWQiOjI2fQ.eaA5VETgpk7ncWrkAE1BTd4Nfm3mbcsq5uVSHWL4xmE'})
        self.assertEqual(request.status_code, status.HTTP_200_OK) 

    def test_get_translation(self):
        request=requests.get("http://127.0.0.1:8000/api/textos/traducir/?from=Inglés&to=Español&texto=Hi how are you" ,headers={'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM3MjcxMDUzLCJqdGkiOiJiYTZlZTg5ODEzZjA0ZmRiOGRlNWQ1YjEyOWQ3NTRkYiIsInVzZXJfaWQiOjI2fQ.eaA5VETgpk7ncWrkAE1BTd4Nfm3mbcsq5uVSHWL4xmE'})
        self.assertEqual(request.status_code, status.HTTP_200_OK) 

    def test_get_translation_latency(self):
        request=requests.get("http://127.0.0.1:8000/api/textos/traducir/?from=Inglés&to=Español&texto=Hi how are you" ,headers={'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM3MjcxMDUzLCJqdGkiOiJiYTZlZTg5ODEzZjA0ZmRiOGRlNWQ1YjEyOWQ3NTRkYiIsInVzZXJfaWQiOjI2fQ.eaA5VETgpk7ncWrkAE1BTd4Nfm3mbcsq5uVSHWL4xmE'})
        self.assertLessEqual(request.elapsed.total_seconds(), 2)

    def test_get_translation(self):
        request=requests.get("http://127.0.0.1:8000/api/textos/traducir/?from=Inglés&to=Español&texto=Hi how are you" ,headers={'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM3MjcxMDUzLCJqdGkiOiJiYTZlZTg5ODEzZjA0ZmRiOGRlNWQ1YjEyOWQ3NTRkYiIsInVzZXJfaWQiOjI2fQ.eaA5VETgpk7ncWrkAE1BTd4Nfm3mbcsq5uVSHWL4xmE'})
        self.assertEqual(request.json()["translations"][0]["translation"], "Hola, ¿cómo estás?")

