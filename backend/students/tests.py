from django.test import TestCase

from testing_utils import authed_client, make_student


class StudentTests(TestCase):
    def setUp(self):
        self.client, self.admin = authed_client()

    def test_create_student(self):
        resp = self.client.post(
            "/api/students/", {"full_name": "New Student", "phone": "9111111111", "email": "new@example.com"}, format="json"
        )
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(resp.data["student_code"].startswith("STU"))
        self.assertEqual(resp.data["summary"]["status"], "no_membership")

    def test_duplicate_phone_rejected(self):
        make_student(phone="9222222222")
        resp = self.client.post("/api/students/", {"full_name": "Dup", "phone": "9222222222"}, format="json")
        self.assertEqual(resp.status_code, 400)

    def test_update_student(self):
        student = make_student()
        resp = self.client.patch(f"/api/students/{student.id}/", {"address": "Updated address"}, format="json")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["address"], "Updated address")

    def test_retrieve_student(self):
        student = make_student()
        resp = self.client.get(f"/api/students/{student.id}/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["id"], student.id)

    def test_search_by_name(self):
        make_student(full_name="Zara Khan", phone="9333333333")
        make_student(full_name="Other Person", phone="9444444444")
        resp = self.client.get("/api/students/?search=Zara")
        self.assertEqual(resp.status_code, 200)
        names = [s["full_name"] for s in resp.data["results"]]
        self.assertIn("Zara Khan", names)
        self.assertNotIn("Other Person", names)

    def test_search_by_phone(self):
        make_student(full_name="Phone Match", phone="9555555555")
        resp = self.client.get("/api/students/?search=9555555555")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 1)

    def test_search_by_student_code(self):
        student = make_student()
        resp = self.client.get(f"/api/students/?search={student.student_code}")
        self.assertEqual(resp.data["count"], 1)
