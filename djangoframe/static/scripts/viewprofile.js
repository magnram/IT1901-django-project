let container = document.querySelector("#container");
let table = document.createElement("table");

///////////////// AJAX
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function ajaxPost( urlurl, element) {
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
        console.log("ajax success");
				if (isFollowed === 0) {
					isFollowed = 1;
					element.innerHTML = "Unfollow"
				} else {
					isFollowed = 0;
					element.innerHTML = "Follow"
				}
    });
}
//////////////// AJAX END
function fillProfile() {
	container.innerHTML += "<h1>"+name+" <i>("+username+")</i></h1>";
	container.innerHTML += "<p>" + bio + "<p>";

    if (userid != 0) {
        addRegisteredButtons();
    }
    container.insertAdjacentHTML('beforeend', "<hr><h2 id='articlesBy'>Articles by " + name +"</h2>");
    if (articles.length > 0) {
        table.className = "supertable sortTable";
    	container.appendChild(table);
    	let tr = document.createElement("tr");
    	let th = document.createElement("th");
        th.onclick = function(){sortTable(0,0)}
    	let th2 = document.createElement("th");
        th2.onclick = function(){sortTable(1,0)}
        let th3 = document.createElement("th");
        th3.onclick = function(){sortTable(2,0)}
    	th.innerText = "Title";
    	th2.innerText = "Author(s)";
    	th3.innerText = "Published";

    	tr.appendChild(th);
        tr.appendChild(th2);
        tr.appendChild(th3);
    	table.appendChild(tr);
        for (let i = 0; i < articles.length; i++) {
            printArticle(articles[i])
        }
	}
}

function printArticle(article) {
    let tr = document.createElement("tr");
    let title = document.createElement("td");
    let authors = document.createElement("td");
    let date = document.createElement("td");

    tr.className = "article";
    title.innerHTML = article.title;
    authors.innerHTML = "";
    for (let i = 0; i < article.authors.length; i++) {
        authors.innerHTML += i > 0 ? ", " + article.authors[i] : article.authors[i];
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

function addRegisteredButtons() {
    let btn = document.createElement("input");
    btn.type = "button";
    btn.className = "black-button";

    let button = document.createElement("button");
    button.className = "black-button";
    let url;
	if (isFollowed === 0) {
		button.innerHTML = "Follow";
        url = "/follow/author/" + profileid + "/";
	} else {
		button.innerHTML = "Unfollow";
        url = "/unfollow/author/" + profileid + "/";
	}
	button.onclick = function () {
	    ajaxPost(url, button);
    }
	container.appendChild(button);

}
fillProfile();
