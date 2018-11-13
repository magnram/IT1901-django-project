let headEl = document.querySelector("head");
let footerEl = document.querySelector("footer");

function implementFooter(){
  headEl.innerHTML += 
	`<link rel="stylesheet" type="text/css" href="/static/style/footer.css">`;
  footerEl.innerHTML = `      
    <h5>Bendik Sandal, Vy Nguyen, Henrik Nergaard, Jonas Rødningen, Eirik Leikvoll, Lars Martin Hodne og Magnus Ramm</h5>

  `;
}
implementFooter();
