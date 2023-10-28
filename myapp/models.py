from django.db import models
from django.contrib.auth.models import (BaseUserManager,AbstractBaseUser,PermissionsMixin)
from django.utils.translation import gettext_lazy as _
# Create your models here.

class UserManager(BaseUserManager):
    def _create_user(self,name,password,**extra_fields):
        user = self.model(name=name,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self,name,password=None,**extra_fields):
        extra_fields.setdefault('is_save',True)
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_superuser',False)
        return self._create_user(name=name,password=password,**extra_fields)
    
    def create_superuser(self,name,password,**extra_fields):
        extra_fields['is_active'] = True
        extra_fields['is_staff'] = True
        extra_fields['is_superuser'] = True
        return self._create_user(name=name,password=password,**extra_fields)
    
class User(AbstractBaseUser,PermissionsMixin):

    
    name = models.CharField(verbose_name=_("name"),max_length=100,null=False,blank=False,unique=True)
    
    is_superuser = models.BooleanField(verbose_name=_("is_superuser"),default=False,)

    is_staff = models.BooleanField(verbose_name=_("is_status"),default=False,)
    
    is_active = models.BooleanField(verbose_name=_("active"),default=True,)
    
    created_at = models.DateTimeField(verbose_name=_("created_at"),auto_now_add=True)

    updatad_at = models.DateTimeField(verbose_name=_("updated_at"),auto_now=True)

    object = UserManager()
    
    USERNAME_FIELD = "name"
    
    def __str__(self):
        return self.name


class Comment(models.Model):
    name = models.CharField(verbose_name=_("comment_name"),max_length=100,null=False,blank=False)
    
    body = models.TextField(verbose_name=_("body"),max_length=100,null=False,blank=True)
    
    created_time = models.DateTimeField(verbose_name=_("comment_created_at"),auto_now=True)
    
    def __str__(self):
        return self.name


class Record_othello(models.Model):
    name = models.CharField(verbose_name=_("player_name"),max_length=100)
    
    record = models.CharField(verbose_name=_("record"),max_length=200,null=False)
    
    size = models.SmallIntegerField(verbose_name=_("size"),null=False)
    
    recorded_time = models.DateTimeField(verbose_name=_("recorded_at"),auto_now=True)
    
    def __str__(self):
        return self.name


class Record_snake(models.Model):
    name = models.CharField(verbose_name=_("player_name"),max_length=100)
    
    score = models.CharField(verbose_name=_("score"),max_length=200,null=False)
    
    recorded_time = models.DateField(verbose_name=_("recorded_at"),auto_now=True)
    
    def __str__(self):
        return self.name