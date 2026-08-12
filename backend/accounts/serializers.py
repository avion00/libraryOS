from django.contrib.auth import password_validation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Admin


class AdminLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = AdminSerializer(self.user).data
        return data


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ["id", "username", "email", "first_name", "last_name", "role", "phone", "is_active", "date_joined"]
        read_only_fields = ["id", "date_joined"]


class AdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = Admin
        fields = ["id", "username", "email", "first_name", "last_name", "role", "phone", "password"]

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = Admin(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user
