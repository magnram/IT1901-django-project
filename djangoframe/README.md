-----Sette opp django-----

1. Pass på at du har siste versjon av python installert

2. I PowerShell(kjørt som admin) kjør: Set-ExecutionPolicy Unrestricted

3. I PowerShell kjør: pip install django

4. Naviger deg til mappen dajangoframe i rep 14 og kjør:
	python manage.py migrate  (bare første gang)

5. I samme mappe kjør:
	python manage.py runserver  

Dette bør sette i gang utviklingsserveren slik at du kan aksesere innholdet vårt på:
	localhost:8000/article,
	localhost:8000/articlemaker,
	localhost:8000/login,
	localhost:8000/needsproof,
	osv.
I en nettleser.


Jeg har lagt over innholdet som til nå er pushet til rep i dette rammeverket. Hvis man videre
skal legge til noe er det smart å oppdatere innholdet inne i denne mappen. 


-----Legge til nye sider-----
1. Inne i mappen pages finner du en python-fil som heter views.py. Denne må oppdaters med en 
   ny funksjon for hver nye side du skal legge til. Funksjonen skal være identisk de som allerede
   står der, bare med egne parametre.
2. Inne i pages er det en mappe som heter templates. Her skal du legge inn HTML-filen
3. I HTML-filen må du på øverste linje skrive {% load static %} og du må bruke f.eks {% static style/CSS-fil %}
   når du referer til en css- eller js-fil istedenfor en normal path
4. Filen du referer til må finnes i mappen static, under enten style(css) eller script(js)
5. Hvis du skal referere til en statisk fil i en js-fil slik som f.eks "head.innerHTML += en eller annen css-fil"
   må du skrive href som en relative path, altså på formen ../static/style/somestyle.css


-----Lage adminrettigheter-----

Naviger til djangoframe i PowerShell og kjør:
	python manage.py createsuperuser

Du kan nå adminsiden ved å gå til localhost:8000/admin i en nettleser

