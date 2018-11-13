// let titleEl = document.querySelector("title");
// let headerEl = document.querySelector("title");
// let containerEl = document.querySelector("#container");
// 
// let permissions = "Admin";
//
// //Todo: followingPeople må lastes med informasjon fra databasen, slik at informasjonen er oppdatert for den aktuelle brukeren.
// let followingPeople = ["bendik","vy"];
// //Todo: followingCategories må lastes med informasjon fra databasen, slik at informasjonen er oppdatert for den aktuelle brukeren.
// let followingCategories = ["Television"];
// let categories = ["World","Politics","Business","Tech","Science","Sports",
// 					"Opinion","Arts","Music","Television","Dance","Movies"];
//
//
// // let usernames = ["bendik","vy","henrik","jonas","eirik","larsmartin","magnus"]
//
// let articles = [
// 	{title: "Det vises tegn", authors:["JK Rolling"], date:"24/07-18", category:categories[1], content:["Para1","Para2","Para3","Para4"], status:"Published", editor:""},
// 	{title: "Fanger alkatraner", authors:["JK Rolling"], date:"22/07-18", category:categories[3], content:["Para1","Para2","Para3","Para4"], status:"Published", editor:""},
// 	{title: "Game of stones", authors:["GRR Marcus"], date:"18/07-18", category:categories[5], content:["Para1","Para2","Para3","Para4"], status:"Published", editor:""},
// 	{title: "Det vises tegn", authors:["JK Rolling", "Eirik Leikvoll"], date:"15/07-18", category:categories[7], content:["Para1","Para2","Para3","Para4"], status:"Published", editor:""},
// 	{title: "Fanger alkatraner", authors:["JK Rolling"], date:"12/07-18", category:categories[9], content:["Para1","Para2","Para3","Para4"], status:"Published", editor:""},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:""},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:""},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"},
// 	{title: "The fable of an unpublished article that never saw the light", authors:["A horrible writer"], date:"09/07-18", category:categories[2], content:["Para1","Para2","Para3","Para4"], status:"Unpublished", editor:"jonasrod"}
// ];
