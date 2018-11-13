let colorChooserDiv = document.getElementById("colorChooser");
let colorTitle = document.getElementById("colorTitle");

let titleChooserDiv = document.getElementById("titleChooser");
let titleTitle = document.getElementById("titleTitle");

let headerChooserDiv = document.getElementById("headerChooser");
let headerTitle = document.getElementById("headerTitle");

let hafR = document.getElementById("hafR");
let hafG = document.getElementById("hafG");
let hafB = document.getElementById("hafB");

let bgR = document.getElementById("bgR");
let bgG = document.getElementById("bgG");
let bgB = document.getElementById("bgB");

let ttlR = document.getElementById("ttlR");
let ttlG = document.getElementById("ttlG");
let ttlB = document.getElementById("ttlB");

let btnR = document.getElementById("btnR");
let btnG = document.getElementById("btnG");
let btnB = document.getElementById("btnB");

let headTitle = document.getElementById("headTitle");

let colorArrow = document.getElementById("colorArrow");
let titleArrow = document.getElementById("titleArrow");
let headerArrow = document.getElementById("headerArrow");

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
var csrftoken = getCookie('csrftoken')

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


function ajaxPost( urlurl) {
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
        });
}

//////////////// AJAX END

colorTitle.onclick = function() {
    if (colorChooserDiv.style.display === "none") {
        colorChooserDiv.style.display = "block";
        colorArrow.className = "arrow-down";
    } else {
        colorChooserDiv.style.display = "none";
        colorArrow.className = "arrow-right";
    }
}

titleTitle.onclick = function() {
    if (titleChooserDiv.style.display === "none") {
        titleChooserDiv.style.display = "block";
        titleArrow.className = "arrow-down";
    } else {
        titleChooserDiv.style.display = "none";
        titleArrow.className = "arrow-right";
    }
}


function previewHaf() {
    document.getElementsByTagName("footer")[0].style = "background-color: rgb(" + hafR.value + ", " + hafG.value + ", " + hafB.value + ");" +
        " color: " + "rgb(" + ttlR.value + ", " + ttlG.value + ", " + ttlB.value + ");";
    document.getElementsByTagName("header")[0].style = "background-color: rgb(" + hafR.value + ", " + hafG.value + ", " + hafB.value + ");" +
        " color: " + "rgb(" + ttlR.value + ", " + ttlG.value + ", " + ttlB.value + ");";

    document.getElementsByClassName("header-element")[0].style = "background-color: rgb(" + hafR.value + ", " + hafG.value + ", " + hafB.value + ");" +
        " color: " + "rgb(" + ttlR.value + ", " + ttlG.value + ", " + ttlB.value + ");";
    document.getElementsByClassName("header-element")[1].style = "background-color: rgb(" + hafR.value + ", " + hafG.value + ", " + hafB.value + ");" +
        " color: " + "rgb(" + ttlR.value + ", " + ttlG.value + ", " + ttlB.value + ");";
    document.getElementById("header-logo").style.color = "rgb(" + ttlR.value + ", " + ttlG.value + ", " + ttlB.value + ")";

    let buttons = document.getElementsByClassName("black-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style = "background-color: rgb(" + btnR.value + ", " + btnG.value + ", " + btnB.value + ");" +
            " color: " + "rgb(" + ttlR.value + ", " + ttlG.value + ", " + ttlB.value + ");";
    }
}

function previewBg() {
    document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(" + bgR.value + ", " + bgG.value + ", " + bgB.value + ")";
}


function submit() {
    ajaxPost("/customiseOptions/" + getHex(bgR.value) + getHex(bgG.value) + getHex(bgB.value) + "/" +
        getHex(hafR.value) + getHex(hafG.value) + getHex(hafB.value) + "/" +
        getHex(ttlR.value) + getHex(ttlG.value) + getHex(ttlB.value) + getHex(btnR.value) + getHex(btnG.value)
        + getHex(btnB.value) + "/" + headTitle.value + "/");
    setTimeout(function() {location.reload();},1000);
}

function submitTtl() {
    ajaxPost("/customiseTitle/" + headTitle.value + "/");
    setTimeout(function() {location.reload();},1000);
}

function reset() {
    ajaxPost("/customiseOptions/DCD0C0/373737/C0B283373737/TheBvhjelmTimes/");
    setTimeout(function() {location.reload();},1000);
}

function setTitle() {
    document.getElementById("header-logo").innerText = headTitle.value;
}

function getHex(num) {
    let digits="0123456789ABCDEF";
    return digits[(num - num%16)/16] + digits[num%16];
}

function getDec(stringValue) {
    let digits="0123456789ABCDEF";
    return 16*digits.indexOf(stringValue.substring(0,1)) + digits.indexOf(stringValue.substring(1,2));
}

document.getElementById("headTitle").value = options.title;

function setValues() {
    hafR.value = getDec(colors.hafColor.substring(0,2));
    hafG.value = getDec(colors.hafColor.substring(2,4));
    hafB.value = getDec(colors.hafColor.substring(4,6));

    bgR.value = getDec(colors.bodyColor.substring(0,2));
    bgG.value = getDec(colors.bodyColor.substring(2,4));
    bgB.value = getDec(colors.bodyColor.substring(4,6));

    ttlR.value = getDec(colors.textColor.substring(0,2));
    ttlG.value = getDec(colors.textColor.substring(2,4));
    ttlB.value = getDec(colors.textColor.substring(4,6));

    btnR.value = getDec(colors.buttonColor.substring(0,2));
    btnG.value = getDec(colors.buttonColor.substring(2,4));
    btnB.value = getDec(colors.buttonColor.substring(4,6));
}
setValues();


