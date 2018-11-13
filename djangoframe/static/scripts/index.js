let container = document.querySelector("#container");
let table = document.querySelector("table");
let catbox = document.querySelector("#cat-box");
let followbox = document.querySelector("#follow-box");
let btnFollowing = document.querySelector("#btnFollowing");
let btnCat = document.querySelector("#btnCat");

//Fra backend:
let userLoggedIn = userid !== 0;

///////////////// AJAX
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken')

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function ajaxPostFollow( urlurl, element) {
    console.log("ajax start");
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });
  $.post(urlurl,
    function(){
        console.log("ajax success")
        element.innerHTML = "Unfollow";
        element.disabled = false
        followingCategories.push(getCategoryFromString(element.dataset.category));
        //catbox.innerHTML = "";
        //printCategories();
    });
}
function ajaxPostUnfollow( urlurl, element) {
    console.log("ajax start");
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post(urlurl,
        function(){
            console.log("ajax success")
            element.innerHTML = "Follow";
            element.disabled = false;
            for (let i = 0; i<followingCategories.length;i++) {
                console.log(element.dataset.category);
                if (followingCategories[i].title === element.dataset.category) {
                    followingCategories.splice(i, 1);
                    break;
                }
            }
            //console.log(followingCategories);
            //catbox.innerHTML = "";
            //printCategories();
        });
}
//////////////// AJAX END

let selectedCategories = [];

function printArticle(article) {
    if (article.status !== "Published") {
        return
    }
    let tr = document.createElement("tr");
    let title = document.createElement("td");
    let authors = document.createElement("td");
    let date = document.createElement("td");

    tr.className = "article";
    title.innerHTML = article.title;
    authors.innerHTML = "";
    for (let i = 0; i < article.authors.length; i++) {
        if (i > 0) {
            authors.innerHTML += ", "
        }
        authors.innerHTML += article.authors[i]
    }
    date.innerHTML = article.date;

    tr.appendChild(title);
    tr.appendChild(authors);
    tr.appendChild(date);
    tr.addEventListener("click", function () {
        window.location = "/article/" + article.id + "/";
        console.log('click');
        return false;
    });
    table.appendChild(tr);
}

function printArticleList() {
    clearArticles();
    //div.onclick = function() {location.href=[ARTICLE]};
    for (let i = 0; i < articles.length; i++) {
        printArticle(articles[i])
    }
}

//Lagt til knapp som setter synligheten til ny-kategori-form til synlig. Naar den trykkes paa kommer form opp og man kan skrive inn ny kategori
function printCategories() {
    catbox.innerHTML += "<button class=\"black-button\" onclick=\"selectAll()\">Select all</button><button class=\"black-button\" onclick=\"deselectAll()\">Deselect all</button><br>";


    for (let i = 0; i < categories.length; i++) {
        catbox.innerHTML += '<input type="checkbox" id="checkbox' + i + '" value=checkbox"' + i + '" onclick="filterArticles()"/>';
        catbox.innerHTML += categories[i].title + " " + getFollowButton(i) + "<br>";
    }
    if(isExecutiveEditor){
        //catbox.innerHTML += "<button class=\"black-button\" onclick=\"NewCat('submitcat')\" id='kategori_knapp'>Add category</button><br>";

        catbox.innerHTML += "<br><b>Category:</b><br><a class='linkbutton' onclick=\"NewCat('submitcat')\" id='kategori_knapp'>add</a> / ";
        catbox.innerHTML +="<a class='linkbutton' onclick=\"DeleteCats()\" id='kategori_knapp_slett'>delete selected</a><br>";

        //Legg til break
        let br = document.createElement("br")
        //Legg til skjema
        let form = document.createElement("form")
        form.id = "submitcat"
        form.method = "post"

        //Legg til key
        let key = document.createElement("input")
        key.type="hidden"
        key.name="csrfmiddlewaretoken"
        key.value=csrftoken

        //Legg til tekstfelt
        let text = document.createElement("input")
        text.type="text"
        text.id="catText"
        text.required = "required"
        text.placeholder="Add category"
        text.name="newcat"
        text.maxLength="15"


        //Legg til submit-button
        let submitButton = document.createElement("input")
        submitButton.type="submit"
        submitButton.id="the_submit_button"
        submitButton.className="black-button"
        submitButton.value="Submit"
        submitButton.onclick=function(){
            form.action = "/addCategory/"+text.value+"/";
        }

        //Legg til cancel-button
        let cancelButton = document.createElement("input")
        cancelButton.type="button"
        cancelButton.id="cancel"
        cancelButton.value="Cancel"
        cancelButton.className="red-button"
        cancelButton.onclick=function(){

            form.style.display = "none";
            text.value=""
            document.getElementById('cancel').style.display = "none";
        }
        cancelButton.innerText="Cancel"

        form.appendChild(br)
        form.appendChild(key)
        form.appendChild(text)
        form.appendChild(submitButton)
        form.appendChild(cancelButton)
        catbox.appendChild(form)

    }
}

function NewCat(string) {
    document.getElementById(string).style.display = "block";
    document.getElementById('cancel').style.display = "block";
}

function DeleteCats() {
    if (selectedCategories != null && selectedCategories.length!=0) {
        str2=""
        str="/deletecategory/"
        for (el of selectedCategories) {
            str += el.id+"+";
            str2 += el.title+", ";

        }
        str = str.substring(0,str.length-1)
        str2 = str2.substring(0,str2.length-2)

        p = prompt("Are you sure you want to delete "+str2+"? there's no going back! y/no")
        if(p.toLowerCase()!="y") {return}
        location.href = str
    } else {
        alert("No categories are selected")
    }


}

//Kjorer url == addCategory med input fra form som ligger i filteret paa indekssiden
function submitcat(){
    event.preventDefault();
    let action_src = "/addCategory/" + document.getElementsByName("newcat")[0].value+"/";
    let your_form = document.getElementById('submitcat');
    your_form.action = action_src;
}

function getFollowButton(catId) {
    return userLoggedIn ? "<button onclick='followBtnClick(event)' class='follow-button' data-category='" + categories[catId].title + "'" + ">"
        + (followsCategory(categories[catId]) ? "Unfollow" : "Follow") + "</button>" : "";
}

function printFollowing() {
    let followingContent = "<br>";
    if (followingPeople.length + followingCategories.length === 0) {
        if(userLoggedIn) {
            followingContent = "You are not following anything"
        } else {
            followingContent = "Log in to take advantage of this feature!"    
        }
    } else {
        for (let i = 0; i < followingPeople.length; i++) {
            followingContent += followingPeople[i].name + "<br>";
        }
        for (let j = 0; j < followingCategories.length; j++) {
            followingContent += followingCategories[j].title + "<br>";
        }
    }
    followbox.innerHTML = followingContent;
}

function clearArticles() {
    while (table.childNodes[2]) {
        table.removeChild(table.childNodes[table.childNodes.length - 1]);
    }
}

function followBtnClick(e) {
    //TODO: her må informasjonen også pushes til databasen.
    e.target.innerHTML += " <img height='10px' src='" + imgsrc + "'>";
    e.target.disabled = true;
    if (!followsCategory(getCategoryFromString(e.target.dataset.category))) {
        ajaxPostFollow("/follow/category/" + getCategoryFromString(e.target.dataset.category).id + "/", e.target);
    } else {
        console.log("/unfollow/category/" + getCategoryFromString(e.target.dataset.category).id + "/");
        ajaxPostUnfollow("/unfollow/category/" + getCategoryFromString(e.target.dataset.category).id + "/", e.target);
    }

}

function addSelectedArticlesToList() {
    for (let i = 0; i < categories.length; i++) {
        let index = selectedCategories.indexOf(categories[i]);
        if (document.getElementById("checkbox" + i).checked && !(index > -1)) {
            selectedCategories.push(categories[i]);
        } else if (!document.getElementById("checkbox" + i).checked && index > -1) {
            selectedCategories.splice(index, 1);
        }
    }
}

//TODO: oppdater for å håndtere kategorier som en streng(etter litt mer tenking kan det faktisk se ut som om denne koden er uberørt)
function printSelectedArticles() {
    if (selectedCategories.length == 0) {
        printArticleList();
        return;
    }
    for (let i = 0; i < articles.length; i++) {
        for (let j = 0; j < selectedCategories.length; j++) {
            if (articles[i].category == selectedCategories[j].title) {
                printArticle(articles[i]);
                break;
            }
        }

    }
}

function printFollowingArticles() {
    clearArticles();
    for (let i = 0; i < articles.length; i++) {
        if ((articles[i].category != "none" && followsCategory(getCategoryFromString(articles[i].category))) || followsUsers(articles[i].authors)) {
            printArticle(articles[i]);
        }
    }
}

function filterArticles() {
    clearArticles();
    addSelectedArticlesToList();
    printSelectedArticles();
}

function selectAll() {
    let toSelect = catbox.getElementsByTagName("input");
    for (let i = 0; i < toSelect.length; i++) {
        toSelect[i].checked = true;
    }
    clearArticles();
    printArticleList();
    for(category of categories) {
        if(!selectedCategories.includes(category)) {
        console.log("test")
        selectedCategories.push(category)
        }
    }
}

function deselectAll() {
    let toSelect = catbox.getElementsByTagName("input");
    for (let i = 0; i < toSelect.length; i++) {
        toSelect[i].checked = false;
    }
    selectedCategories = []
    clearArticles();
    printArticleList();
}

btnFollowing.onclick = function () {
    catbox.style.display = "none";
    followbox.style.display = "block";
    btnFollowing.classList.add("btnselected");
    btnCat.classList.remove("btnselected");
    btnCat.classList.add("btndeselected");
    btnFollowing.classList.remove("btndeselected");
    printFollowing();
    printFollowingArticles();
};
btnCat.onclick = function () {
    followbox.style.display = "none";
    catbox.style.display = "block";
    btnFollowing.classList.remove("btnselected");
    btnCat.classList.add("btnselected");
    btnCat.classList.remove("btndeselected");
    btnFollowing.classList.add("btndeselected");
    printArticleList();
};

//Retunerer true dersom brukeren følger kategorien cat(Streng), og false dersom brukeren ikke er logget inn eller ikke følger kategorien
function followsCategory(cat) {
    for (let i = 0; i < followingCategories.length; i++) {
        if (cat.id === followingCategories[i].id) return true;
    }
    return false
}

function followsUsers(users) {
    for (let i = 0; i < followingPeople.length; i++) {
        for (let j = 0; j < users.length; j++) {
            let user = users[j];
            if (user === followingPeople[i].name) return true;
        }
    }
    return false
}

function getCategoryFromString(cat) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].title === cat) return categories[i];
    }
    return null;
}

const searchBar = document.querySelector("#searchBar");
function search() {
    clearArticles();
    addSelectedArticlesToList();
    for (article of articles) {
        if(searchBar != null && article.title.toLowerCase().includes(searchBar.value.toLowerCase())) {
            printArticle(article);
        }
    }
}

printArticleList();
printCategories();
