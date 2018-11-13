from django.urls import path
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    url(r'^$', views.redirect),
    path('article', views.article, name ='article'),
    path('articlemaker', views.articlemaker, name ='articlemaker'),
    url(r'^updatearticle/(?P<id>\d+)/$', views.update_article, name = 'articleUpdate'),
    url(r'^articleeditor/(?P<id>\d+)/$', views.articleeditor, name = 'articleEdit'),
    url(r'^update_article/(?P<id>\d+)/(?P<status>[\w-]+)/$', views.update_article),
    url(r'^customiseOptions/(?P<background>[\w-]+)/(?P<footer>[\w-]+)/(?P<text>[\w-]+)/(?P<title>[\w -]+)/$', views.customiseOptions),
    url(r'^customiseTitle/(?P<title>[\w -]+)/$', views.customiseTitle),
    url(r'^updatebio/$', views.updatebio, name = 'updatebio'),
    path('editprofile', views.editprofile, name ='editprofile'),
    path('index', views.index, name ='index'),
    url(r'^addCategory/(?P<title>[\w -]+)/$', views.addCategory),
    path('customise', views.customise, name ='customise'),
    path('login', views.login, name ='login'),
    path('needsproof', views.needsproof, name ='needsproof'),
    path('profile', views.profile, name ='profile'),
    path('statistics', views.statistics, name ='statistics'),
    # url(r'^profile$', views.profile),
    url(r'^profile/(?P<id>\d+)/$', views.viewprofile),
    path('savedarticles', views.savedarticles, name ='savedarticles'),
    path('following', views.following, name ='following'),
    path('template', views.template, name ='template'),
    url(r'^article/(?P<id>\d+)/$', views.article),
    url(r'^create_article/(?P<saveMode>[\w-]+)/$', views.create_article),
    url(r'^unfollow/(?P<type>[\w-]+)/(?P<id>\d+)/$', views.unfollow),
    url(r'^follow/(?P<type>[\w-]+)/(?P<id>\d+)/$', views.follow),
    url(r'^assigneditor/(?P<id>\d+)/$', views.assigneditor),
    url(r'^assigneditor/(?P<id>\d+)/(?P<editorId>\d+)/$', views.assignEditorExecutive),
    url(r'^unassigneditor/(?P<id>\d+)/$', views.unassigneditor),
    url(r'^savearticle/(?P<id>\d+)/$', views.savearticle),
    url(r'^unsavearticle/(?P<id>\d+)/$', views.unsavearticle),
    url(r'^publish_article/(?P<id>\d+)/$', views.publish_article),
    url(r'^unpublish_article/(?P<id>\d+)/$', views.unpublish_article),
    url(r'^complete_article/(?P<id>\d+)/$', views.mark_article_complete),
    url(r'^createcomment/(?P<status>[\w-]+)/(?P<id>\d+)/$', views.createcomment),
    url(r'^deletecomment/(?P<id>\d+)/$', views.deletecomment),
    url(r'^deletearticle/(?P<id>\d+)/$', views.deletearticle),
    url(r'^deletecategory/(?P<categories>[0-9+]+)/$', views.deletecategory),
    url(r'^likearticle/(?P<id>\d+)/$', views.likearticle),
    url(r'^login/$', views.login),
    url(r'^loginuser/$', views.loginuser),
    url(r'^logoutuser/$', views.logoutuser),
    url(r'^registeruser/$', views.registeruser),
    url(r'^createrequest/$',views.createrequest),
    url(r'^deletearticlecomment/(?P<articleid>\d+)/(?P<id>\d+)/$', views.deletearticlecomment),
    url(r'^editarticlecomment/(?P<articleid>\d+)/(?P<id>\d+)/$', views.editarticlecomment),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
