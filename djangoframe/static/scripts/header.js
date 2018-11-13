var header = document.querySelector("header");
var head = document.querySelector("head");
var referred = "";
let siteTitle = "The Bvhjelm Times";
if(usernameID=="") {
  usernameID = "LOG IN"
}
console.log(usernameID)

function implementHeader() {
    head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/style/header.css">';
    header.innerHTML =
        '<a href="/index"><div class="header-element">ARTICLES</div></a>' +
        '<div id="header-logo">'+siteTitle+'</div>' +
        '<a href="/profile"><div class="header-element">'+usernameID.toUpperCase()+'</div></a>';
}
implementHeader();
