// let containerEl = document.querySelector("#container");
let userLoggedIn = userid !== 0;
let titleEl = document.querySelector("title");
let headerEl = document.querySelector("title");
let containerEl = document.querySelector("#container2");

if (article === undefined) {
  let article = {
    title: "Den forsvunne artikkel",
    authors: ["Forsvant", "Så", "Plutselig"],
    date: "15/07-18",
    category: categories[7],
    content: ["Denne artikkelen finnes desverre ikke", "404", "404", "404"],
    status: "Published",
    assignedTo: ""
  }
} else {
  article.content = article.content.split('\r\n')
}

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
        if (isSaved === 1 && element.value == "Unsave article") {
          element.value = "Save article";
          isSaved = 0;
        }
        else if (element.value == "Save article") {
          element.value = "Unsave article";
          isSaved = 1;
        }
    });
}
function ajaxPostLike( urlurl, element) {
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
            if (liked) {
                liked = 0;
                element.innerHTML = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
            } else {
                liked = 1;
                element.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
            }
        });
}
//////////////// AJAX END

function fillProfile() {
  titleEl.innerHTML = article.title;

  containerEl.innerHTML += "<h1>" + article.title + " <i>(" + article.date + ")</i></h1>";
  containerEl.innerHTML += "<hr>";
  let string = "";
  // for (let i = 0; i < article.authors.length; i++) {
    // if (i < (article.authors.length - 2)) {
    //   string += article.authors[i] + ", ";
    // } else
    // if (i == (article.authors.length - 2)) {
    //   string += article.authors[i] + " and ";
    // } else {
    //   string += article.authors[i];
    // }
  // }
  if(article.author === userid) {
    string += "<a href='/profile'>" + article.authors[0] + "</a>"
  } else {
    string += "<a href='/profile/" + article.author + "/'>" + article.authors[0] + "</a>"
  }
  if (article.authors.length === 2) {
    string += " and ";
    if(article.coauthor === userid) {
      string += "<a href='/profile'>" + article.authors[1] + "</a>"
    } else {
      string += "<a href='/profile/" + article.coauthor + "/'>" + article.authors[1] + "</a>"
    }
  }
  containerEl.innerHTML += "<h6>By: " + string + "</h6>";
  try {
      if (image !== '') {
        containerEl.innerHTML += '<img src="' + image + '" alt="" id="image">'
      }
  } catch {
      containerEl.innerHTML += "Image could not be displayed"
  }

  for (var i = 0; i < article.content.length; i++) {
    // console.log(article.content)
    containerEl.innerHTML += "<p>" + article.content[i] + "</p>";
  }

  let buttonDiv = document.createElement("div");
  buttonDiv.id = "buttonDiv";
  containerEl.appendChild(buttonDiv);

  if (article.status === "Published" || article.status !== "Draft" && article.editor === username) {
      let commentdiv = document.querySelector("#comment");
      if (article.status === "Published") {
          let commentsDiv = document.createElement("div");
          commentsDiv.id = "comments";

          for (let i = 0; i<comments.length; i++) {
              let commentData = comments[i];
              let commentTitle = document.createElement("p");
              commentTitle.insertAdjacentHTML("beforeend", "<b>(" + commentData.timestamp + ") " + commentData.user + " wrote: </b>");

              let commentContent = document.createElement("p");
              commentContent.innerText += commentData.content;
              commentContent.id="commentContent"+i;

              let commentButtons = document.createElement("p");
              commentButtons.id="commentButtons"+i;
              if(commentData.user == username || isAdmin) {
                let commentButtonsText = "<a onclick='editarticlecomment("+i+","+commentData.id+")' class='regular'>edit</a> <a href='../../deletearticlecomment/"+article.id+"/"+commentData.id+"' class='red'>delete</a>"
                commentButtonsText;
                commentButtons.innerHTML = commentButtonsText;
              }
              //<a onclick='editarticlecomment("+commentContent+")' class='red'>delete</a>
              //
              //
              let comment = document.createElement("div");
              comment.appendChild(commentTitle);
              comment.appendChild(commentContent);
              comment.appendChild(commentButtons);
              commentsDiv.appendChild(comment);


          }
          commentdiv.insertAdjacentHTML("afterbegin", commentsDiv.outerHTML)
      }
    // containerEl.innerHTML += "<h1 id='kommentar'>Kommentar:</h1><hr><br><textarea></textarea>"
    commentdiv.style.display = "block";
    if(userLoggedIn) {
        document.getElementById("formSubmit").formaction = article.status === "Published" ? "/createcomment/Published/" + article.id + "/" : "/createcomment/Unpublished/" + article.id + "/";
        document.getElementById("formText").placeholder = article.status === "Published" ? "Write comment here" : "Write comment here (this will show up for the author (& coauthor) when he visits his profile page)";
    }

  }
}

let btn = document.createElement("input");
btn.type = "button";
//TODO: type = submit og lage url i django + formaction="url" - Jonas

function editarticlecomment(i,commentDataId) {
  let id = "commentContent"+i
  let buttonid = "commentButtons"+i
  let comment = document.getElementById(id)
  document.getElementById(buttonid).style.display = "none"
  comment.innerHTML = `
  <form method="post">
  <input type="hidden" name="csrfmiddlewaretoken" value="`+csrftoken+`"/>
  <textarea name="editarticlecomment">`+comment.innerText+`</textarea>
  <input type="submit" formaction="/editarticlecomment/`+article.id+`/`+commentDataId+`/" class="black-button" value="Submit changes">
  </form>
  `
}

function addButtons() {
    let buttonDiv = document.getElementById("buttonDiv");
    if (article.status === "Published") {
        let br = document.createElement("br");
        //Rating knapper
        let likeDiv = document.createElement("div");
        likeDiv.id = "likeDiv";
        let likeBtn = document.createElement("div");
        likeBtn.id = "likeBtn";
        likeBtn.innerHTML = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
        let likeCount = document.createElement("div");
        likeCount.id = "likeCount";
        if (liked==1) {
            likeBtn.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i>'
        }
        likeCount.innerText = likescount;

        likeBtn.onclick = function () {
            //location.href = "/likearticle/" + article.id + "/";
            if (userLoggedIn) {
                ajaxPostLike("/likearticle/" + article.id + "/",likeBtn);
            }
        };

        likeDiv.appendChild(likeBtn);
        likeDiv.appendChild(likeCount);
        buttonDiv.appendChild(likeDiv);

        buttonDiv.appendChild(br);

        // Facebook og twitter knapper
        let shareLinkFacebook = document.createElement("a");
        let shareLinkTwitter = document.createElement("a");
        shareLinkFacebook.innerHTML = "Del på facebook!";
        shareLinkTwitter.innerHTML = "Del på twitter!";
        shareLinkFacebook.className = "shareLinkFacebook";
        shareLinkTwitter.className = "shareLinkTwitter";
        shareLinkFacebook.href = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
        shareLinkTwitter.href = "https://twitter.com/share?url=" + window.location.href;
        shareLinkFacebook.target = "_blank";
        shareLinkTwitter.target = "_blank";
        buttonDiv.appendChild(shareLinkFacebook);
        buttonDiv.appendChild(shareLinkTwitter);
        buttonDiv.appendChild(br);
        buttonDiv.appendChild(br);
    }
    if(userLoggedIn && (userid === article.author || userid === article.coauthor || (username === article.editor && article.status === "Unpublished"))) {
      let button = btn.cloneNode(true);
      button.value = "Edit";
      button.className = "black-button";
      button.onclick = function() {
        location.href = "../../articleeditor/"+article.id+"/"
      };
      buttonDiv.appendChild(button);
    }
    if(userLoggedIn && (isAdmin || isExecutiveEditor || userid === article.author || userid === article.coauthor || (username === article.editor && (article.status === "Unpublished" || article.status === "Completed")))) {
        let button = btn.cloneNode(true);
        button.value = "Delete";
        button.className = "red-button";
        button.onclick = function() {
            //DELETE THE ARTICLE FROM DATABASE
            ajaxPost("/deletearticle/" + article.id + "/", button);
            location.href = ("/index");
        };
        buttonDiv.appendChild(button);
    }
    if(userLoggedIn && ( isAdmin || isExecutiveEditor || username === article.editor) && article.status === "Unpublished") {
      let button = btn.cloneNode(true);
      button.value = "Mark as complete";
      button.className = "black-button";
      button.onclick = function() {
          url = "/complete_article/" + article.id + "/";
          ajaxPost(url, button);
          button.value = "Marked as complete";
          button.disabled = true;
          setTimeout(
                  function(){window.location.reload(true)}
          ,500);
      };
      buttonDiv.appendChild(button);
    }
    if(userLoggedIn && ( isAdmin || isExecutiveEditor || username === article.editor) && article.status === "Completed") {
      let button = btn.cloneNode(true);
      button.value = "Mark as incomplete";
      button.className = "black-button";
      button.onclick = function() {
          url = "/unpublish_article/" + article.id + "/";
          ajaxPost(url, button);
          button.value = "Marked as incomplete";
          button.disabled = true;
          setTimeout(
                  function(){window.location.reload(true)}
          ,500);
      };
      buttonDiv.appendChild(button);
    }
    if(article.status === "Published" && userid != article.author && userid != article.coauthor){
      let button = btn.cloneNode(true);
      if (isSaved === 1) {
        button.value = "Unsave article"
      } else {
        button.value = "Save article";
      }
      button.className = "black-button";
      button.onclick = function() {
        if (isSaved === 1) {url = "/unsavearticle/" + article.id + "/"}
        else { url = "/savearticle/" + article.id + "/"}
        ajaxPost(url, button)
      };
      if(userLoggedIn) {
        buttonDiv.appendChild(button);
      }
    }
    if(userLoggedIn && (isAdmin || isExecutiveEditor) && article.status === "Published") {
      let button = btn.cloneNode(true);
      button.value = "Unpublish";
      button.className = "black-button";
      button.onclick = function() {
          url = "/unpublish_article/" + article.id + "/";
          ajaxPost(url, button);
          button.value = "Unpublished";
          button.disabled = true;
          setTimeout(
                  function(){window.location.reload(true)}
          ,500);
      };
      buttonDiv.appendChild(button);
    }
    if(userLoggedIn && (isAdmin || isExecutiveEditor) && (article.status === "Unpublished" || article.status === "Completed")) {
      let button = btn.cloneNode(true);
      button.value = "Publish";
      button.className = "black-button";
      button.onclick = function() {
          url = "/publish_article/" + article.id + "/";
          ajaxPost(url, button);
          button.value = "Published";
          button.disabled = true;
          setTimeout(
                  function(){window.location.reload(true)}
          ,500);
      };
      buttonDiv.appendChild(button);
    }
    /* else {
      if (article.status === "Unpublished" && article.editor === username) {
        // let button = btn.cloneNode(true);
        // button.value = "Send comment";
        // button.className = "black-button";
        // button.onclick = function() {};
        // container.appendChild(button);
      }
    */
}
fillProfile();
addButtons();
