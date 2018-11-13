from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse, HttpResponseForbidden
from django.forms.models import model_to_dict
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.contrib import auth
from django.contrib.auth import authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from pages.models import Article, Category, Follow, Saved, Userbio, Comment, Siteoption, articleComment, Userlikes
from django.contrib.auth.models import User
import operator



# INFO: hvis siden skal bruke AJAX, må man skrive @ensure_csrf_cookie over definisjonen av siden (se på following)

########### Metoder ###########

def redirect(request):
    return HttpResponseRedirect('/index')

def article2dict(instance):
    try:
        name = instance.author.get_full_name()
    except:
        name = instance.author.get_username()
    if name == "":
        name = instance.author.get_username()
    authors = [name]
    coauthorid = 0
    if instance.status == "Published":
        action = "/createcomment/Published/" + str(instance.id) + "/"
    else:
        action = "/createcomment/Unublished/" + str(instance.id) + "/"
    if instance.coauthors != 0:
        coauthor = User.objects.get(id=instance.coauthors)
        coauthorid = coauthor.id
        coauthorname = coauthor.first_name + " " + coauthor.last_name
        authors.append(coauthorname)
    dict = {
        'title': instance.title,
        'authors': authors,
        'author': instance.author_id,
        'coauthor': coauthorid,
        'content': instance.content,
        'date': instance.timestamp.strftime("%d.%m.%Y"),
        'categories': instance.category,
        'id': instance.id,
        'editor': instance.editor,
        'status': instance.status,
        'action': action,
    }
    return dict


def getCategoryList():
    liste = list(Category.objects.order_by('title').values("title", "id"))
    return liste

def addCategory(request, title = "title"):
    if not request.user.is_authenticated:
        raise PermissionDenied
    print("It got so far")
    cat = Category(title = title)
    cat.save()
    return HttpResponseRedirect('/index')


def create_article(request, saveMode="draft"):
    title = request.POST['article_title']
    coauthors = request.POST['co_author']
    content = request.POST['article_content']
    category = request.POST['article_category']
    author = request.user
    image = ""
    if len(request.FILES) != 0:
        image = request.FILES['image']
    if saveMode == "draft":
        status = "Draft"
    elif saveMode == "toreview":
        status = "Unpublished"
    else:
        status = ""
    instance = Article(title=title, author=author, coauthors=coauthors, content=content, status=status,
                       category=category, image=image)
    instance.save()
    return HttpResponseRedirect('/savedarticles')


def deletearticle(request, id=0):
    article = Article.objects.get(id=id)
    article.delete()
    return HttpResponseRedirect('/index')


def unfollow(request, type="author", id=0):
    userid = request.user.id
    if type == "author":
        relation = Follow.objects.get(author=id, user_id=userid)
    else:
        relation = Follow.objects.get(category=id, user_id=userid)
    relation.delete()
    print("delete requested for: ", relation)
    response = HttpResponse("Successfully deleted")
    return response


def siteoption():
    try:
        dbdict = Siteoption.objects.get(id=1)
    except:
        dbdict = Siteoption(title="TheBvhjelmTimes", headercolor="373737", bodycolor="DCD0C0",
                            footercolor="C0B283373737")
        dbdict.save()
    returnString = "<style> body {background-color: #" + dbdict.bodycolor + ";}"
    returnString += "footer, .header-element, #filter .box, #filter .filter-part, #header-logo, header div, " \
                    ".black-button, .supertable th {color: #" + dbdict.footercolor[0:6] + ";}"
    returnString += "footer, .header-element, .supertable th, #filter .box, #filter .filter-part, header {background-color: #" + dbdict.headercolor + ";}"
    returnString += ".black-button {background-color: #" + dbdict.footercolor[6:] + ";} #likeBtn { background-color: #" + dbdict.footercolor[6:] + "; color: #" + dbdict.footercolor[0:6] + ";}"
    returnString += "#likeCount {background-color: #" + dbdict.headercolor + "99; color: #" + dbdict.footercolor[0:6] + ";}</style>"

    dict = {}
    dict["title"] = dbdict.title
    dict["style"] = returnString
    return dict


def customiseOptions(request, background="#FFFFFF", footer="#FFFFFF", text="#FFFFFF", title="title"):
    if not request.user.is_authenticated:
        raise PermissionDenied
    optionDict = Siteoption.objects.get(id=1)
    optionDict.title = title
    optionDict.bodycolor = background
    optionDict.headercolor = footer
    optionDict.footercolor = text
    optionDict.save()
    return HttpResponseRedirect('/customise')


def customiseTitle(request, title="title"):
    if not request.user.is_authenticated:
        raise PermissionDenied
    print(title)
    optionDict = Siteoption.objects.get(id=1)
    optionDict.title = title
    optionDict.save()
    return HttpResponseRedirect('/customise')


def follow(request, type="author", id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    userid = request.user.id
    if type == "author":
        try:
            Follow.objects.get(author=id, user_id=userid).delete()
        except:
            pass
        relation = Follow(author=id, category=0, user_id=userid)
    else:
        try:
            Follow.objects.get(category=id, user_id=userid).delete()
        except:
            pass
        relation = Follow(category=id, author=0, user_id=userid)
    relation.save()
    print("follow requested for: ", relation)
    response = HttpResponse("Successfully followed")
    return response


def update_article(request, status="toreview", id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    article = Article.objects.get(id=id)
    article.title = request.POST['article_title']
    article.coauthors = request.POST['co_author']
    article.content = request.POST['article_content']
    article.category = request.POST['article_category']
    if len(request.FILES) != 0:
        article.image = request.FILES['image']
    if status == "draft":
        article.status = "Draft"
    elif status == "toreview":
        article.status = "Unpublished"
    article.save()

    return HttpResponseRedirect('/savedarticles')


def publish_article(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    artikkel = Article.objects.get(id=id)
    artikkel.status = "Published"
    artikkel.save()
    return HttpResponseRedirect('/index')


def unpublish_article(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    artikkel = Article.objects.get(id=id)
    artikkel.status = "Unpublished"
    artikkel.save()
    return HttpResponseRedirect('/index')


def mark_article_complete(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    artikkel = Article.objects.get(id=id)
    artikkel.status = "Completed"
    artikkel.save()
    return HttpResponseRedirect('/index')

def cleanList(liste):
    users = list(User.objects.all().order_by('id').values('id', 'first_name', 'last_name', 'username'))
    for article in liste:
        authors = []
        authorid = article['author']
        authorname = ""
        for user in users:
            if (authorid == user['id']):
                authorname += user['first_name'] + " " + user['last_name']
                if authorname == " ":
                    authorname = user['username']
                break
        authors.append(authorname)
        if article['coauthors'] != 0:
            coauthorid = article['coauthors']
            coauthorname = ""
            for user in users:
                if (coauthorid == user['id']):
                    coauthorname += user['first_name'] + " " + user['last_name']
                    if coauthorname == " ":
                        coauthorname = user['username']
                    break
            authors.append(coauthorname)
        article['date'] = article['timestamp'].strftime("%d.%m.%Y")
        article.pop('timestamp')
        article['authors'] = authors
    return liste


def assigneditor(request, id=None):
    if not request.user.is_authenticated:
        raise PermissionDenied
    userid = request.user.id
    artikkel = Article.objects.get(id=id)
    artikkel.editor = request.user.username
    artikkel.save()
    response = HttpResponse("Successfully assigned editor")
    return response


def assignEditorExecutive(request, id=None, editorId=None):
    if not request.user.is_authenticated:
        raise PermissionDenied
    artikkel = Article.objects.get(id=id)
    if is_editor(User.objects.get(id=editorId)):
        artikkel.editor = User.objects.get(id=editorId).username
        artikkel.save()
        response = HttpResponse("Successfully assigned editor")
        return response
    response = HttpResponse("Not an editor")
    return response

def unassigneditor(request, id=None):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if not is_editor(request.user):
        return HttpResponseRedirect('/index')
    artikkel = Article.objects.get(id=id)
    artikkel.editor = ""
    artikkel.save()
    response = HttpResponse("Successfully unassigned editor")
    return response


def is_author(user):
    author = user.groups.filter(name='Author').exists()
    admin = user.is_superuser
    return (author or admin)


def is_editor(user):
	editor = user.groups.filter(name='Editor').exists()
	executive_editor = user.groups.filter(name='Executive Editor').exists()
	admin = user.is_superuser
	return (editor or admin or executive_editor)

def is_executive_editor(user):
	executive_editor = user.groups.filter(name='Executive Editor').exists()
	admin = user.is_superuser
	return (executive_editor or admin)


def updatebio(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    user = request.user
    bio = request.POST['profile_bio']
    layout = request.POST['layout']
    if Userbio.objects.filter(user=user).exists():
        bioInstance = Userbio.objects.filter(user=user)[0]
        bioInstance.bio = bio
    else:
        bioInstance = Userbio(user=user, bio=bio)
    bioInstance.save()

    if Userbio.objects.filter(user=user).exists():
        layoutInstance = Userbio.objects.filter(user=user)[0]
        layoutInstance.layout = layout
    else:
        layoutInstance = Userbio(user=user, layout=layout)
    layoutInstance.save()

    if user.get_full_name != request.POST['profile_name']:
        name = request.POST['profile_name'].split(" ")
        first_name = name[0]
        last_name = name[1]
        user.first_name = first_name
        user.last_name = last_name
        user.save()
    return HttpResponseRedirect('/profile')


def savearticle(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if id != 0:
        savedrelation = Saved(user=request.user, article=id)
        savedrelation.save()
        response = HttpResponse("Successfully saved")
        return response


def unsavearticle(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if id != 0 and request.user.is_authenticated:
        savedrelation = Saved.objects.get(user=request.user, article=id)
        savedrelation.delete()
        response = HttpResponse("Successfully deleted")
        return response


def createcomment(request, status="Published", id=None):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if request.user.is_authenticated:
        if status != "Published":
            content = request.POST['content']
            author = request.POST['author']
            coauthor = request.POST['coauthor']
            articletitle = request.POST['articletitle']
            comment = Comment(content=content, author=author, coauthor=coauthor, articletitle=articletitle)
            comment.save()
            return HttpResponseRedirect('/needsproof')
        content = request.POST['content']
        user = request.user
        articlecomment = articleComment(content=content, article=id, user=user)
        articlecomment.save()
    return HttpResponseRedirect('/article/' + id)

def createrequest(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    userid = request.user.id
    content = request.POST['content']
    request = Comment(author=0, username=request.user.username, content=content, request=1)
    request.save()
    return HttpResponseRedirect('/profile')

def deletecomment(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if id!=0:
        comment = Comment.objects.get(id=id)
        userid = request.user.id
        if comment.coauthor == userid:
            if comment.author != 0:
                comment.coauthor = 0
                comment.save()
            else:
                comment.delete()
        else:
            if comment.coauthor != 0:
                comment.author = 0
                comment.save()
            else:
                comment.delete()
        return HttpResponseRedirect('/profile')


def loginuser(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)

    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect('/profile')
    else:
        return render(request, "login.html", {'wrongdetails': 1})


def logoutuser(request):
    logout(request)
    return HttpResponseRedirect('/login')


def registeruser(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            auth.login(request, user)
            return HttpResponseRedirect('/profile')
        else:
            return render(request, 'register.html', {'form': form, 'wronginfo': 1})
    else:
        form = UserCreationForm()
        return render(request, 'register.html', {'form': form})

def likearticle(request, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    userid = request.user.id
    if id !=0:
        if Userlikes.objects.filter(userid=userid,articleid=id).exists():
            like = Userlikes.objects.filter(userid=userid, articleid=id)[0]
            like.delete()
        else:
            like = Userlikes(userid = userid, articleid = id)
            like.save()
    return HttpResponseRedirect('/article/'+id)

def deletearticlecomment(request, articleid=0, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if id != 0:
        if articleComment.objects.filter(id=id).exists():
            articlecomment = articleComment.objects.filter(id=id)
            articlecomment.delete()
            return HttpResponseRedirect('/article/'+articleid)

@ensure_csrf_cookie
def editarticlecomment(request, articleid=0, id=0):
    if not request.user.is_authenticated:
        raise PermissionDenied
    if id != 0:
        if articleComment.objects.filter(id=id).exists():
            articlecomment = articleComment.objects.get(id=id)
            articlecomment.content = request.POST['editarticlecomment']
            articlecomment.save()
            # articlecomment = articleComment.objects.filter(id=id)
            # newcontent = request.POST['editarticlecomment']
            # articlecomment.values("content")[0]["content"] = newcontent
            # articlecomment.save()
            return HttpResponseRedirect('/article/'+articleid)

def deletecategory(request,categories=""):
    if not request.user.is_authenticated:
        raise PermissionDenied
    liste = list(map(int, categories.split("+")))
    print("----------------------")
    print(liste)
    print("----------------------")
    selectedCategories = []
    for i in liste:
        selectedCategories.append(Category.objects.filter(id=i))

    for i in selectedCategories:
        i.delete()
    return HttpResponseRedirect('/index')

########### Pages ###########
@ensure_csrf_cookie
def article(request, id=None):
    userid = 0
    isSaved = 0
    isAdmin = 0
    isExecutiveEditor = 0
    if request.user.is_authenticated:
        userid = request.user.id
        if (Saved.objects.filter(user=request.user, article=id).exists()):
            isSaved = 1
    if id != None:
        username = request.user.username
        instance = get_object_or_404(Article, id=id)
        likes = list(Userlikes.objects.filter(articleid=id))
        likescount = len(likes)

        # instance = model_to_dict(instance)
        commentList = []
        if (articleComment.objects.filter(article=id).exists()):
            comments = list(articleComment.objects.filter(article=id))
            for comment in comments:
                commentDict = {}
                commentDict["id"] = comment.id
                commentDict["user"] = comment.user.username
                commentDict["content"] = comment.content
                commentDict["timestamp"] = comment.timestamp.strftime("%d.%m.%Y")
                commentList.append(commentDict)

        dict = article2dict(instance)
        commentList = list(commentList)
        if request.user.is_superuser:
            isAdmin = 1
        if is_executive_editor(request.user):
            isExecutiveEditor = 1
        if instance.image != "":
            image = instance.image.url
        else:
            image = ""
        if Userlikes.objects.filter(userid=userid,articleid=id).exists():
            liked = 1
        else:
            liked = 0
        context = {
            'username': username,
            'isAdmin': isAdmin,
            'isExecutiveEditor': isExecutiveEditor,
            'instance': dict,
            'categoriesList': getCategoryList(),
            'userid': userid,
            'isSaved': isSaved,
            'site': siteoption(),
            'image': image,
            'likescount': likescount,
            'comments': commentList,
            'liked': liked,
        }
        return render(request, "article.html", context)
    else:
        return render(request, "article.html", {'userid': userid, 'username': "undefined"})


def articlemaker(request, id=0):
    if not is_author(request.user) or not request.user.is_authenticated:
        raise PermissionDenied

    title = "New article"
    if id != 0:
        title = "Edit article"
        # TODO: sjekke permission for user,
        # TODO: legg til article-values i form-field...
        # TODO: legg til url for edit
    authors = list(
        User.objects.filter(groups__name='Author').order_by('first_name').values('id', 'first_name', 'last_name'))
    admins = list(User.objects.filter(is_superuser=1).order_by('first_name').values('id', 'first_name', 'last_name'))
    for user in admins:
        if user not in authors:
            authors.append(user)
    for dict in authors:
        name = dict['first_name'] + " " + dict['last_name']
        if name != " ":
            dict['name'] = name
        else:
            dict['name'] = dict['username']
        dict.pop('first_name')
        dict.pop('last_name')
    context = {
        "title": title,
        "categories": getCategoryList,
        "authors": authors,
        "userid": request.user.id,
        'site': siteoption(),
    }
    return render(request, "articlemaker.html", context)



def articleeditor(request, id=0):
    if (not is_author(request.user) and not is_editor(request.user)) or not request.user.is_authenticated:
        raise PermissionDenied

    article = Article.objects.get(id=id)
    title = article.title
    content = article.content
    coauthorId = article.coauthors
    category = article.category
    status = article.status;
    if article.image != "":
        image = article.image.url
    else:
        image = ""

    authors = list(
        User.objects.filter(groups__name='Author').order_by('first_name').values('id', 'first_name', 'last_name'))
    admins = list(User.objects.filter(is_superuser=1).order_by('first_name').values('id', 'first_name', 'last_name'))
    for user in admins:
        if user not in authors:
            authors.append(user)
    for dict in authors:
        name = dict['first_name'] + " " + dict['last_name']
        if name != " ":
            dict['name'] = name
        else:
            dict['name'] = dict['username']
        dict.pop('first_name')
        dict.pop('last_name')
    context = {

        "title": title,
        "categories": getCategoryList,
        "authors": authors,
        "content": content,
        "coauthorId": coauthorId,
        "category": category,
        "status": status,
        "id": id,
        "image": image,
        'site': siteoption(),
    }
    return render(request, "articleeditor.html", context)


def editprofile(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    user = request.user
    if Userbio.objects.filter(user=user).exists():
        bio = Userbio.objects.filter(user=user).values("bio")[0]["bio"]
        layout = Userbio.objects.filter(user=user).values("layout")[0]["layout"]
    else:
        bio = ""
        layout = 1
    try:
        name = request.user.get_full_name
    except:
        name = ""
    context = {
        "bio": bio,
        "name": name,
        "layout": layout,
        'site': siteoption(),
    }

    return render(request, "editprofile.html", context)


@ensure_csrf_cookie
def index(request):
    followingAuthors = []
    followingCategories = []
    userid = 0
    isExecutiveEditor = 0
    categories = getCategoryList()
    if is_executive_editor(request.user):
            isExecutiveEditor = 1

    # Hvis bruker er logget inn:
    if request.user.is_authenticated:
        userid = request.user.id
        relations = list(Follow.objects.filter(user_id=userid).values("category", "author"))
        authors = list(User.objects.all().values('id', 'first_name', 'last_name'))
        for relation in relations:
            if relation['category'] != 0:
                for cat in categories:
                    if cat['id'] == relation['category']:
                        followingCategories.append(cat)
                        break
            else:
                for author in authors:
                    if author['id'] == relation['author']:
                        followingAuthors.append(author)
                        break
        for dict in followingAuthors:
            name = dict['first_name'] + " " + dict['last_name']
            dict['name'] = name
            dict.pop('first_name')
            dict.pop('last_name')

    liste = list(
        Article.objects.filter(status="Published").order_by('-timestamp').values("title", "id", "author", "coauthors",
                                                                                 "timestamp", "category", "status"))
    liste = cleanList(liste)
    context = {
        'articlelist': liste,
        'categorieslist': categories,
        'followingauthors': followingAuthors,
        'followingcategories': followingCategories,
        'userid': userid,
        'site': siteoption(),
        'isExecutiveEditor': isExecutiveEditor,

    }
    return render(request, "index.html", context)


def login(request):
    context = {
        'site': siteoption
    }
    return render(request, "login.html", context)


@ensure_csrf_cookie
def needsproof(request):
	#TODO: burde være logget inn og editor for å se siden
	if not is_editor(request.user) or not request.user.is_authenticated:
		raise PermissionDenied
	isExecutive = 0
	username = request.user.username
	if is_executive_editor(request.user):
		isExecutive = 1
		liste = list(Article.objects.filter(Q(status="Unpublished") | Q(status="Completed")).order_by('timestamp').values("title", "id", "author", "coauthors", "timestamp", "status", "editor"))
	else:
		liste = list(Article.objects.filter(status="Unpublished").order_by('-timestamp').values("title", "id", "author", "coauthors", "timestamp", "status", "editor"))
	liste = cleanList(liste)

	returnEditors = []
	editors = list(User.objects.filter(is_staff=1))
	editors += list(User.objects.filter(groups__name="Editor"))
	editors += list(User.objects.filter(groups__name="Executive Editor"))
	for editor in editors:
		content = {}
		content["id"] = editor.id
		content["name"] = editor.username
		returnEditors.append(content)

	context = {
		'site': siteoption(),
		'articlelist': liste,
		'categoriesList': getCategoryList(),
		'username': username,
		'editors': returnEditors,
		'isExecutive': isExecutive,
	}
	return render(request, "needsproof.html", context)


def profile(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login')
    user = request.user
    if Userbio.objects.filter(user=user).exists():
        bio = Userbio.objects.filter(user=user).values("bio")[0]["bio"]
    else:
        bio = "Bio for this user is not created yet"
    comments = []
    if Userbio.objects.filter(user=user).exists():
        layout = Userbio.objects.filter(user=user).values("layout")[0]["layout"]
    else:
        layout = 1

    isExecutiveEditor = 0
    isAuthor = 0
    isEditor = 0
    isAdmin = 0

    if is_executive_editor(user):
        isExecutiveEditor = 1
    if is_author(user):
        isAuthor = 1
        comments = list(
            Comment.objects.filter(Q(author=user.id) | Q(coauthor=user.id)).values("id", "author", "coauthor",
                                                                                   "content", "articletitle", "username","request"))
    if is_editor(user):
        isEditor = 1
    if user.is_superuser:
        isAdmin = 1
        comments = list(
            Comment.objects.filter(Q(author=user.id) | Q(coauthor=user.id) | Q(request=1)).values("id", "author", "coauthor",
                                                                                   "content", "articletitle", "username","request"))
    print(comments)
    context = {
        'site': siteoption(),
        "isExecutiveEditor": isExecutiveEditor,
        'isAuthor': isAuthor,
        'isEditor': isEditor,
        'isAdmin': isAdmin,
        'user': user,
        'biotext': bio,
        'comments': comments,
        'layout':layout,
    }

    return render(request, "profile.html", context)


@ensure_csrf_cookie
def viewprofile(request, id=0):
    userid = 0
    isFollowed = 0
    if request.user.is_authenticated:
        userid = request.user.id
        if str(userid) == str(id):
            return profile(request)
        if Follow.objects.filter(user_id=userid, author=id).exists():
            isFollowed = 1
    targetuser = User.objects.get(id=id)
    articleList = Article.objects.filter(Q(author=id) | Q(coauthors=id)).filter(status="Published").order_by(
        '-timestamp')
    returnList = []
    for article in articleList:
        instance = get_object_or_404(Article, id=article.id)
        dict = article2dict(instance)
        dict["content"] = ""
        returnList.append(dict)
    if Userbio.objects.filter(user=id).exists():
        bio = Userbio.objects.filter(user=id).values("bio")[0]["bio"]
    else:
        bio = "Bio for this user is not created yet"
    context = {
        'site': siteoption(),
        'isFollowed': isFollowed,
        'userid': userid,
        'user': request.user,
        'biotext': bio,
        'targetuser': targetuser.get_username,
        'name': targetuser.get_full_name,
        'id': id,
        'articleList': list(returnList),
    }

    return render(request, "viewprofile.html", context)


def savedarticles(request):
    if not request.user.is_authenticated:
        raise PermissionDenied

    userid = request.user.id
    allarticles = list(
        Article.objects.filter(status="Published").order_by('-timestamp').values("title", "id", "author", "coauthors",
                                                                                 "timestamp", "status", "editor"))
    savedrelations = list(Saved.objects.filter(user_id=userid).values("article"))
    authorMatch = list(User.objects.filter(groups__name='Author', id=userid))
    isAuthor = 0
    if is_author(request.user):  # If author
        ownarticles = list(
            Article.objects.filter(Q(author_id=userid) | Q(coauthors=userid)).order_by('-timestamp').values("title",
                                                                                                            "id",
                                                                                                            "author",
                                                                                                            "coauthors",
                                                                                                            "timestamp",
                                                                                                            "status"))
        ownarticles = cleanList(ownarticles)
        isAuthor = 1
    else:
        ownarticles = []

    savedarticles = []
    for relation in savedrelations:  # Filter saved
        for article in allarticles:
            if relation['article'] == article['id']:
                savedarticles.append(article)
                break
    savedarticles = cleanList(savedarticles)

    context = {
        'site': siteoption(),
        'ownarticles': ownarticles,
        'isAuthor': isAuthor,
        'savedarticles': savedarticles,
    }
    return render(request, "savedarticles.html", context)


@ensure_csrf_cookie
def following(request):
    if not request.user.is_authenticated:
        raise PermissionDenied

    userid = request.user.id
    relations = list(Follow.objects.filter(user_id=userid).values("category", "author"))
    authors = list(User.objects.all().values('id', 'first_name', 'last_name'))
    categories = getCategoryList()
    followingAuthors = []
    followingCategories = []
    for relation in relations:
        if relation['category'] != 0:
            for cat in categories:
                if cat['id'] == relation['category']:
                    followingCategories.append(cat)
                    break
        else:
            for author in authors:
                if author['id'] == relation['author']:
                    followingAuthors.append(author)
                    break
    for dict in followingAuthors:
        name = dict['first_name'] + " " + dict['last_name']
        dict['name'] = name
        dict.pop('first_name')
        dict.pop('last_name')
    print(followingAuthors)
    context = {
        'site': siteoption(),
        'authors': followingAuthors,
        'categoriesList': followingCategories,
    }
    return render(request, "following.html", context)


def template(request):
    return render(request, "template.html", {})


@ensure_csrf_cookie
def customise(request):
    if not request.user.is_superuser:
        raise PermissionDenied
    dbdict = Siteoption.objects.get(id=1)
    returnDict = {}
    returnDict["textColor"] = dbdict.footercolor[0:6]
    returnDict["hafColor"] = dbdict.headercolor
    returnDict["bodyColor"] = dbdict.bodycolor
    returnDict["buttonColor"] = dbdict.footercolor[6:]
    context = {
        'site': siteoption(),
        'colors': returnDict,
    }
    return render(request, "customise.html", context)


def statistics(request):
    if not is_executive_editor(request.user) or not request.user.is_authenticated:
        raise PermissionDenied

    categories = getCategoryList();
    users = list(User.objects.all().order_by('id').values('id', 'first_name', 'last_name', 'username'))
    articles = list(Article.objects.filter(status="Published").order_by('-timestamp').values("title", "id", "author", "coauthors", "timestamp", "status", "editor"))
    likerelations = list(Userlikes.objects.all().values("articleid"))
    authorrelations = list(Follow.objects.filter(category=0).values("author"))
    categoryrelations = list(Follow.objects.filter(author=0).values("category"))
    commentrelations = list(articleComment.objects.all().values("article"))
    savedrelations = list(Saved.objects.all().values("article"))
#START MOSTPOPULARAUTHORS
    dict = {}
    for element in authorrelations:
        if element["author"] in dict:
            dict[element["author"]] += 1
        else:
            dict[element["author"]] = 1
    sortedDict = sorted(dict.items(), key=lambda x: x[1], reverse=True)
    liste = []
    for el in sortedDict:
        for user in users:
            if user["id"] == el[0]:
                l = {"id": el[0],"name": user["first_name"]+" "+user["last_name"],"followers": el[1]}
                liste.append(l)
#END MOSTPOPULARAUTHORS

#START MOSTPOPULARCATEGORIES
    dict2 = {}
    for element in categoryrelations:
        if element["category"] in dict2:
            dict2[element["category"]] += 1
        else:
            dict2[element["category"]] = 1
    sortedDict2 = sorted(dict2.items(), key=lambda x: x[1], reverse=True)
    liste2 = []
    for el in sortedDict2:
        for category in categories:
            if category["id"] == el[0]:
                l = {"name": category["title"],"followers": el[1]}
                liste2.append(l)
#END MOSTPOPULARCATEGORIES

#START MOSTCOMMENTEDARTICLES
    dict3 = {}
    for element in commentrelations:
        if element["article"] in dict3:
            dict3[element["article"]] += 1
        else:
            dict3[element["article"]] = 1
    sortedDict3 = sorted(dict3.items(), key=lambda x: x[1], reverse=True)
    liste3 = []
    for el in sortedDict3:
        for article in articles:
            if article["id"] == el[0]:
                l = {"id": el[0], "title": article["title"],"comments": el[1]}
                liste3.append(l)
#END MOSTCOMMENTEDARTICLES

#START MOSTLIKEDARTICLES
    dict4 = {}
    for element in likerelations:
        if element["articleid"] in dict4:
            dict4[element["articleid"]] += 1
        else:
            dict4[element["articleid"]] = 1
    sortedDict4 = sorted(dict4.items(), key=lambda x: x[1], reverse=True)
    liste4 = []
    for el in sortedDict4:
        for article in articles:
            if article["id"] == el[0]:
                l = {"id": el[0], "title": article["title"],"likes": el[1]}
                liste4.append(l)
#END MOSTLIKEDARTICLES

#START MOSTACTIVEAUTHORS
    dict5 = {}
    for element in articles:
        if element["author"] in dict5:
            dict5[element["author"]] += 1
        else:
            dict5[element["author"]] = 1
        if element["coauthors"] in dict5:
            dict5[element["coauthors"]] += 1
        elif element["coauthors"] != 0:
            dict5[element["coauthors"]] = 1
    sortedDict5 = sorted(dict5.items(), key=lambda x: x[1], reverse=True)
    liste5 = []
    for el in sortedDict5:
        for user in users:
            if user["id"] == el[0]:
                l = {"id": el[0],"name": user["first_name"]+" "+user["last_name"],"articles": el[1]}
                liste5.append(l)
#END MOSTACTIVEAUTHORS

#START MOSTSAVEDARTICLES
    dict6 = {}
    for element in savedrelations:
        if element["article"] in dict6:
            dict6[element["article"]] += 1
        else:
            dict6[element["article"]] = 1
    sortedDict6 = sorted(dict6.items(), key=lambda x: x[1], reverse=True)
    liste6 = []
    for el in sortedDict6:
        for article in articles:
            if article["id"] == el[0]:
                l = {"id": el[0], "title": article["title"],"saves": el[1]}
                liste6.append(l)
#END MOSTSAVEDARTICLES

    context = {
        "categories": getCategoryList,
        "users": users,
        "liste": liste,
        "liste2": liste2,
        "liste3": liste3,
        "liste4": liste4,
        "liste5": liste5,
        "liste6": liste6,
        "site": siteoption,
    }
    return render(request, "statistics.html", context)
