let writtenArticleDiv = document.querySelector("#writtenArticleDiv");
let savedArticleDiv = document.querySelector("#savedArticleDiv");
let ownarticleTable = document.querySelector("#own");
let articletable = document.querySelector("#saved");

function printArticle(article, table) {
  let tr = document.createElement("tr");
  let title = document.createElement("td");
  let authors = document.createElement("td");
  let date = document.createElement("td");
  let status = document.createElement("td");

  tr.className = "article";
  title.innerHTML = article.title;
  date.innerHTML = article.date;
  status.innerHTML = article.status;
  authors.innerHTML = "";
  for (let i = 0; i < article.authors.length; i++) {
    if (i > 0) {
      authors.innerHTML += ", "
    }
		authors.innerHTML += article.authors[i]
	}

  tr.appendChild(title);
  tr.appendChild(authors);
  tr.appendChild(date);
  tr.appendChild(status);
  title.addEventListener("click", function() {
    window.location = "/article/" + article.id + "/";
  });
  table.appendChild(tr)
}

function printArticleList(articleList, table) {
	for (let i = 0; i < articleList.length; i++) {
		printArticle(articleList[i], table)
	}
}

function clearArticles() {
	while (table.childNodes[2]) {
    	table.removeChild(table.childNodes[table.childNodes.length-1])
	}
}

if(isAuthor === 1) {
  printArticleList(ownarticles, ownarticleTable)
} else {
  writtenArticleDiv.style.display = 'none';
}
if (articles.length > 0) {
  printArticleList(articles, articletable)
} else {
  articletable.style.display = "none";
  savedArticleDiv.innerHTML += "<p style='text-align: center;'>You have not saved any articles yet. Try clicking the save button when viewing an article.</p>"
}
