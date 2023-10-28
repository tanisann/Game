from django.contrib import admin
from django.contrib.auth.models import Group

from .models import User, Comment,Record_othello
# Register your models here.

admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Record_othello)
admin.site.unregister(Group)