from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    lastname = models.CharField(max_length=150)
    firstname = models.CharField(max_length=150)
    middlename = models.CharField(max_length=150, blank=True, null=True)
    birthday = models.DateField()
    age = models.IntegerField()
    address = models.TextField()
    contact_number = models.CharField(max_length=15)
    id_number = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.user.username} Profile'