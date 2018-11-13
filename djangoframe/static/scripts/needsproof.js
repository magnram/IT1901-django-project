let container = document.querySelector("#article-list");
let table = document.querySelector("table");
let httpRequest;

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
let csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function ajaxPost( urlurl, element, isAssign, editorName) {
    console.log("ajax start, waiting for response through the terribly slow database connection...");
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
        element.disabled = false;
        if (isAssign) {
          element.innerHTML = editorName;
          element.disabled = editorName !== USERNAME && !isExecutive;
          element.parentNode.removeChild(element.parentNode.childNodes[1]);
        } else {
          element.innerHTML = "Assign to self";
          if (isExecutive) {
              element.innerHTML = "Assign to:";
              let dropdown = document.createElement("select");
              for (let i = 0; i < editors.length; i++) {
                  let option = document.createElement("option");
                  option.value = editors[i].id;
                  option.innerText = editors[i].name;

                  dropdown.append(option)
              }
              element.parentNode.appendChild(dropdown);
              element.parentNode.classList.add("assignWithList")
          }

          element.disabled = false
        }
    });
}
//////////////// AJAX END

function printArticle(article) {
  if (article.status !== "Unpublished" && article.status !== "Completed") {
    return
  }
  let tr = document.createElement("tr");

  let title = document.createElement("td");
    title.addEventListener("click", function () {
        window.location = "/article/" + article.id + "/";
        console.log('click');
        return false;
    });
  let authors = document.createElement("td");
    authors.addEventListener("click", function () {
        window.location = "/article/" + article.id + "/";
        console.log('click');
        return false;
    });
  let date = document.createElement("td");
    date.addEventListener("click", function () {
        window.location = "/article/" + article.id + "/";
        console.log('click');
        return false;
    });
  let assign = document.createElement("td");
  let assignbutton = document.createElement("button");
  if (article.editor != "") {
    assignbutton.innerHTML = article.editor;
    if (article.editor == USERNAME || isExecutive) {
      assignbutton.disabled = false
    } else {
      assignbutton.disabled = true
    }
  }
  let status = document.createElement("td");
  status.innerHTML = article.status;



  assignbutton.className = "assign-button";
  assignbutton.type = "button";
  tr.className = "article";
  title.innerHTML = article.title;
  authors.innerHTML = "";
  for (let i = 0; i < article.authors.length; i++) {
    if (i > 0) {
      authors.insertAdjacentHTML("beforeend", ", ")
    }
    authors.insertAdjacentHTML("beforeend", article.authors[i])
  }
  date.innerHTML = article.date;
  if (article.editor === "") {
    assignbutton.innerHTML = isExecutive ? "Assign to:" : "Assign to self"
  } else {
    assignbutton.innerHTML = article.editor;
  }
  assignbutton.addEventListener("click", function() {
    if ((assignbutton.innerHTML === "Assign to self" || assignbutton.innerHTML === "Assign to:" ) && !assignbutton.disabled) {
        assignbutton.disabled = !isExecutive;
        if (isExecutive) {
            let select = assignbutton.parentNode.childNodes[1];
            url = "/assigneditor/" + article.id + "/" + select[select.selectedIndex].value + "/";
            assignbutton.insertAdjacentHTML("beforeend", " <img height='10px' src='" + imgsrc + "'>");
            ajaxPost(url, assignbutton, true, select[select.selectedIndex].innerText);
            return;
        }
      url = "/assigneditor/" + article.id + "/";
      assignbutton.insertAdjacentHTML("beforeend", " <img height='10px' src='" + imgsrc + "'>");
      ajaxPost(url, assignbutton, true, USERNAME)
    } else if (assignbutton.innerHTML === USERNAME && article.editor === USERNAME || isExecutive) {
      console.log("NÅ!")
        assignbutton.disabled = !isExecutive;
      url = "/unassigneditor/" + article.id + "/";
        assignbutton.insertAdjacentHTML("beforeend", " <img height='10px' src='" + imgsrc + "'>");
      ajaxPost(url, assignbutton, false, USERNAME)
    }
    // else {
    //   assignbutton.innerHTML = "Assign to self"
    // }
  });

  tr.appendChild(title);
  tr.appendChild(authors);
  tr.appendChild(date);
  tr.appendChild(assign);
  tr.appendChild(status);
  assign.appendChild(assignbutton);
  if (isExecutive && (assignbutton.innerHTML === "Assign to self" || assignbutton.innerHTML === "Assign to:" )) {
      let dropdown = document.createElement("select");
      for (let i = 0; i < editors.length; i++) {
          let option = document.createElement("option");
          option.value = editors[i].id;
          option.innerText = editors[i].name;

          dropdown.append(option)
      }
      assign.append(dropdown);
      assign.classList.add("assignWithList")
  }
  title.addEventListener("click", function() {
    console.log("hey")
  });
  table.appendChild(tr)
}


function printArticleList() {
	//div.onclick = function() {location.href=[ARTICLE]};
	for (let i = 0; i < articles.length; i++) {
		printArticle(articles[i])
	}
}

function clearArticles() {
	while (table.childNodes[2]) {
    	table.removeChild(table.childNodes[table.childNodes.length-1])
	}
}

printArticleList();
