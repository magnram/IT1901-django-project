from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Article(models.Model):
	author = models.ForeignKey(settings.AUTH_USER_MODEL, default=1, on_delete=models.CASCADE)
	title = models.CharField(max_length=120)
	content = models.TextField()
	updated = models.DateTimeField(auto_now=True, auto_now_add=False)
	timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)
	coauthors = models.IntegerField(blank=True, default=0)
	editor = models.CharField(max_length=50, blank=True)
	status = models.CharField(max_length=50)
	category = models.CharField(max_length=50)
	image = models.ImageField(blank=True, default="")

	def __str__(self):
		return self.title

class Userlikes(models.Model):
	articleid = models.IntegerField(default=0)
	userid = models.IntegerField(default=0)
	#SELECT sum(likes) FROM article,userLikes WHERE article.articleid = userlikes.articleid

class Category(models.Model):
	title = models.CharField(max_length=50)

	def __str__(self):
		return self.title

class Follow(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1, on_delete=models.CASCADE)
	category = models.IntegerField(blank=True, default=0)
	author = models.IntegerField(blank=True, default=0)

class Saved(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1, on_delete=models.CASCADE)
	article = models.IntegerField(blank=True)

class Userbio(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1, on_delete=models.CASCADE)
	bio = models.TextField(blank=True)
	layout = models.IntegerField(default=1)

	def __str__(self):
		return self.user.username

class Comment(models.Model):
	author = models.IntegerField()
	coauthor = models.IntegerField(blank=True, default=0)
	content = models.TextField()
	articletitle = models.CharField(max_length=120)
	username = models.CharField(max_length=120, blank=True, default="")
	request = models.IntegerField(default=0)

class articleComment(models.Model):
	article = models.IntegerField(blank=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1, on_delete=models.CASCADE)
	timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)
	content = models.TextField()

class Siteoption(models.Model):
	title = models.CharField(max_length=120)
	headercolor = models.CharField(max_length=20)
	bodycolor = models.CharField(max_length=20)
	footercolor = models.CharField(max_length=20)
