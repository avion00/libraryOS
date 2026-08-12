from django.test import TestCase
from rest_framework.test import APIClient

from testing_utils import create_admin


class AuthTests(TestCase):
    def setUp(self):
        self.admin = create_admin(username="loginuser")
        self.client = APIClient()

    def test_login_success(self):
        resp = self.client.post("/api/auth/login", {"username": "loginuser", "password": "Test@12345"}, format="json")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data["user"]["username"], "loginuser")

    def test_login_invalid_password(self):
        resp = self.client.post("/api/auth/login", {"username": "loginuser", "password": "wrong"}, format="json")
        self.assertEqual(resp.status_code, 401)

    def test_login_missing_fields(self):
        resp = self.client.post("/api/auth/login", {"username": "loginuser"}, format="json")
        self.assertEqual(resp.status_code, 400)

    def test_protected_route_without_token(self):
        resp = self.client.get("/api/students/")
        self.assertEqual(resp.status_code, 401)

    def test_protected_route_with_token(self):
        login = self.client.post("/api/auth/login", {"username": "loginuser", "password": "Test@12345"}, format="json")
        token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        resp = self.client.get("/api/students/")
        self.assertEqual(resp.status_code, 200)

    def test_logout_blacklists_refresh_token(self):
        login = self.client.post("/api/auth/login", {"username": "loginuser", "password": "Test@12345"}, format="json")
        access, refresh = login.data["access"], login.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        resp = self.client.post("/api/auth/logout", {"refresh": refresh}, format="json")
        self.assertEqual(resp.status_code, 200)
        refresh_resp = self.client.post("/api/auth/refresh", {"refresh": refresh}, format="json")
        self.assertEqual(refresh_resp.status_code, 401)
