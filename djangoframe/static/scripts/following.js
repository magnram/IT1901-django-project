let authors = document.querySelector(".flex-left");
let categorieslist = document.querySelector(".flex-right");
let authorstable = authors.children[0];
let categoriestable = categorieslist.children[0];
let httpRequest;


//////////// AJAX
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
let csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function ajaxPost( urlurl, element) {
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
        element.parentNode.removeChild(element)
    });
}

//////////// AJAX END

function printTable(table, name, isCategory) {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let buttontd = document.createElement("td");
  let button = document.createElement("button");

  button.innerHTML = "Unfollow";
  if (isCategory) {
    td.innerHTML = name.title
  } else {
    td.innerHTML = name.name
    td.onclick = function () {
        location.href = "/profile/" + name.id + "/";
    }
  }
  buttontd.appendChild(button);
  tr.appendChild(td);
  tr.appendChild(buttontd);

  table.appendChild(tr);

  button.addEventListener("click", function() {
    console.log("Unfollow pressed");
    let url = "";
    button.disabled = true;
    button.innerHTML += " <img height='10px' src='" + imgsrc + "'>";
    if (isCategory) {
      url = "/unfollow/category/" + name.id + "/"
    } else {
      url = "/unfollow/author/" + name.id + "/"
    }
    ajaxPost(url, tr)
  })
}

function printAuthorsList() {
  for (let i = 0; i < usernames.length; i++) {
    // if(followingPeople.indexOf(usernames[i]) != -1){
    printTable(authorstable, usernames[i], false)
    // }
  }
}
function printCategorylist() {
  for (let i = 0; i < categories.length; i++) {
    // if(followingCategories.indexOf(categories[i]) != -1){
    printTable(categoriestable, categories[i], true)
    // }
  }
}

function clearArticles() {
	while (table.childNodes[2]) {
    	table.removeChild(table.childNodes[table.childNodes.length-1])
	}
}

printAuthorsList();
printCategorylist();
