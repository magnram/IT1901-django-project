const container = document.querySelector("#container");
const disabler = document.querySelector(".disable-site")
if(layout==2) {
    container.innerHTML += "<br><br>"
}
container.innerHTML += "<div id='nameContainer'><h1 id='name'>"+name+" <i>("+username+")</i></h1></div>"
container.innerHTML += "<div id='bioContainer'><p id='bio'>" + bio + "<p></div>";
container.innerHTML += "<div id='btnContainer'></div";

console.log("layout:" + layout)
const nameContainer = document.querySelector("#nameContainer");
const bioContainer = document.querySelector("#bioContainer");
const btnContainer = document.querySelector("#btnContainer");
let btn = document.createElement("input");
btn.type = "button";
btn.className = "black-button";

console.log(isExecutiveEditor);
function fillButtons() { //TODO
    addbutton("Logout", "/logoutuser/");
    addbutton("Edit Profile", "/editprofile");
    addbutton("Saved Articles", "/savedarticles");
    addbutton("Following", "/following");
    if(isExecutiveEditor) {
        addbutton("Watch Statistics", "/statistics");
    }
    if(isAuthor) {
        addbutton("New Article", "/articlemaker")
    }
	if(isEditor) {
        addbutton("Needs Proofreading", "/needsproof");
	}
    if(isAdmin) {
        addbutton("Administrate site", "/admin");
        addbutton("Edit appearance", "/customise")
    }
    let button = btn.cloneNode(true);
    button.value = "Send admin-request";
    button.onclick= function() {
        document.querySelector(".requesttoadmin").style="display: block";
        disabler.style="display:block;";

    };
    btnContainer.appendChild(button);
}

function hideRequest() {
    document.querySelector(".requesttoadmin").style="display: none";
    disabler.style="display:none;";
}

function addbutton(value, url) {
    let button = btn.cloneNode(true);
    button.value = value;
    button.onclick= function() {location.href = url};
    btnContainer.appendChild(button);
}
fillButtons();

function layoutCheck() {
    if(layout==1) {

    } else if(layout==2) {
        nameContainer.style = `
        width: 50%;
        text-align: left;
        float:left;
        `
        bioContainer.style = `
        width:50%;
        float:right;
        `
        btnContainer.style = `
        width:50%;
        float: left;
        word-wrap: wrap;
        `
    }
}
layoutCheck()
