from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'rol']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            rol=validated_data['rol'],
            #foto=validated_data.get('foto')
        )
        return user