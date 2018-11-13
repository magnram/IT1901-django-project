var dropdown = document.querySelector("#dropdown-menu");

function fillDropDown() {
  for (var i = 0; i < categories.length; i++) {
  	var option = document.createElement("option");
  	option.value = categories[i];
  	option.innerHTML = categories[i];
  	dropdown.appendChild(option);
  }
}
