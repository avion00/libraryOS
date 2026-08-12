from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from audit.utils import log_action

from .models import Admin
from .serializers import (
    AdminCreateSerializer,
    AdminLoginSerializer,
    AdminSerializer,
    ChangePasswordSerializer,
)


class LoginView(TokenObtainPairView):
    serializer_class = AdminLoginSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "login"

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get("username", "")
            user = Admin.objects.filter(username=username).first()
            log_action(user, "login", user, request=request)
        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except TokenError:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        log_action(request.user, "logout", request.user, request=request)
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(AdminSerializer(request.user).data)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_action(request.user, "change_password", request.user, request=request)
        return Response({"detail": "Password changed successfully."})


class AdminListCreateView(generics.ListCreateAPIView):
    """Admin-of-admins management — only superadmins may create new admin accounts."""

    queryset = Admin.objects.all().order_by("username")

    def get_serializer_class(self):
        return AdminCreateSerializer if self.request.method == "POST" else AdminSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        if request.user.role != Admin.ROLE_SUPERADMIN:
            return Response({"detail": "Only super admins can create admin accounts."}, status=403)
        response = super().create(request, *args, **kwargs)
        log_action(request.user, "create_admin", None, changes={"username": request.data.get("username")}, request=request)
        return response
