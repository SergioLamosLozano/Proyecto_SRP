from rest_framework import serializers
from .models import administrador


class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = administrador
        fields = '__all__'