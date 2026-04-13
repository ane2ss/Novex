from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import authentication
from django.contrib.auth.models import AnonymousUser


class SimpleUser:
    """A minimal user object built from JWT claims — no DB lookup needed."""
    def __init__(self, user_id):
        self.id = user_id
        self.pk = user_id
        self.is_authenticated = True
        self.is_active = True


class JWTStatelessAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        header = request.META.get("HTTP_AUTHORIZATION", "")
        if not header.startswith("Bearer "):
            return None
        token_str = header.split(" ")[1]
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token_str)
            user_id = validated_token.get("user_id")
            if not user_id:
                return None
            return (SimpleUser(int(user_id)), validated_token)
        except (InvalidToken, TokenError):
            return None