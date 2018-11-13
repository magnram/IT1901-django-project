def username_processor(request):
 username = request.user.username
 return {'username': username}
