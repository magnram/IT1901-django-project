from django.contrib import admin

# Register your models here.
from pages.models import Article, Category, Follow, Saved, Userbio

class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "updated", "timestamp"]
    list_filter = ["updated", "timestamp"]
    class Meta:
        model = Article

admin.site.register(Article)
admin.site.register(Category)
admin.site.register(Follow)
admin.site.register(Saved)
admin.site.register(Userbio)
