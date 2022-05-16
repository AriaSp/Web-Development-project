function say(){
    var search = document.getElementById("books").value;
    
    fetch("https://reststop.randomhouse.com/resources/works/?search=" + search, {
        method : 'GET',
        headers :{
            'Accept' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(jsondata => {
        var data = jsondata;
        var node;
        console.log(data)
        document.getElementById("booklist").innerHTML = ""

        if (data["work"].length==null){
            appendB(data["work"])
        }

        for (i = 0; i < data["work"].length; i++) {
           appendBook(data["work"], i);
        }
    })
}

function appendB(data) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(data.titleSubtitleAuth);
    node.appendChild(textnode); 
    document.getElementById("booklist").appendChild(node);
    
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "LOVE IT";
    btn.onclick = function(){
        if(this.innerHTML == "LOVE IT") {
            this.innerHTML = "LEAVE IT"; 
            const sendData = {"answer": "ADD", "work_id": data.workid, "title": data.titleweb, "author": data.authorweb}
            const options = {
                method: "POST", 
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin' : 'http://localhost:8080/books',
                    'Access-Control-Allow-Credentials' : 'true'
                    }
            }
            fetch('http://localhost:8080/books',options) 
            alert("This book has been added successfully!!")
        }else {
            this.innerHTML = "LOVE IT"; 
            const sendData = {"answer": "DELETE", "work_id": data.workid, "title": data.titleweb, "author": data.authorweb}
            const options = {
                method: "POST", 
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin' : 'http://localhost:8080/books',
                    'Access-Control-Allow-Credentials' : 'true'
                    }
            }
            fetch('http://localhost:8080/books',options) 
            alert("Undo this action successfully!")                 
        }
    };
    document.getElementById("booklist").appendChild(btn);
}

function appendBook(data, i){
    var node = document.createElement("LI");
    var textnode = document.createTextNode(data[i].titleSubtitleAuth);
    node.appendChild(textnode); 
    document.getElementById("booklist").appendChild(node);
    
    
    var btn = document.createElement("BUTTON");
    btn.id = i ;
    btn.innerHTML = "LOVE IT";
    btn.onclick = function(){
        if(this.innerHTML == "LOVE IT") {
            this.innerHTML = "LEAVE IT"; 
            const sendData = {"answer": "ADD", "work_id": data[this.id].workid, "title": data[this.id].titleweb, "author": data[this.id].authorweb}
            const options = {
                method: "POST", 
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin' : 'http://localhost:8080/books',
                    'Access-Control-Allow-Credentials' : 'true'
                    }
            }
            fetch('http://localhost:8080/books',options) 
            alert("This book has been added successfully!!")
        }else {
            this.innerHTML = "LOVE IT"; 
            const sendData = {"answer": "DELETE", "work_id": data[this.id].workid, "title": data[this.id].titleweb, "author": data[this.id].authorweb}
            const options = {
                method: "POST", 
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin' : 'http://localhost:8080/books',
                    'Access-Control-Allow-Credentials' : 'true'
                    }
            }
            fetch('http://localhost:8080/books',options) 
            alert("Undo this action successfully!")                 
        }
    };
    document.getElementById("booklist").appendChild(btn);
}

function showFavorites(){
    const options = {
        method : 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    }
    fetch('http://localhost:8080/books', options)
    .then(response => response.json())
    .then(jsondata => {
        console.log(jsondata);
        document.getElementById("list").innerHTML = ""
        
        var templates = {}
        var dataScript = document.getElementById("book-template")
        templates.contactDetails = Handlebars.compile(dataScript.textContent)
        var dataShow;
        for(var i = 0; i < jsondata.length; i++){
            dataShow = templates.contactDetails({
                data : [{
                    id : jsondata[i].work_id,
                    title : jsondata[i].title,
                    author : jsondata[i].author,
                    review :jsondata[i].review
                }]
            })
            document.getElementById("list").innerHTML += dataShow;
        }
    })  
}

function deleteme(id){
    console.log(id)
    $(id).remove();

    const options = {
        method : 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch('http://localhost:8080/book/' + id, options)
    .then(response => response.json())
    .then(jsondata => {

    })
    location.reload();
}

function editme(id){
    var newwindow = window.open('edit.html')

    newwindow.onload = function(){
    const options = {
        method : 'POST',
        body: JSON.stringify({"work_id":id}),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : 'http://localhost:8080/edit',
            'Access-Control-Allow-Credentials' : 'true'
            }
    }
    fetch('http://localhost:8080/edit', options)
    .then(response => response.json())
    .then(jsondata => {
        newwindow.console.log(jsondata[0]);
        var templates = {}
        var dataScript =  newwindow.document.getElementById("form-template")
        templates.contactDetails = Handlebars.compile(dataScript.textContent)
        var dataShow;
        dataShow = templates.contactDetails({
            data : [{
                id : jsondata[0].work_id,
                title : jsondata[0].title,
                author : jsondata[0].author,
                review :jsondata[0].review
            }]
        })
        
        newwindow.document.getElementById("formdata").innerHTML += dataShow;
        
        newwindow.document.getElementById("submit").value = jsondata[0].work_id;

        newwindow.document.getElementById("titlename").value = jsondata[0].title;
        newwindow.document.getElementById("authorname").value = jsondata[0].author;
        newwindow.document.getElementById("review").value = jsondata[0].review ;
    })
    
}
}

function searchbar(){
    var input = document.getElementById("lovely").value;
    const sendData = {"searchkey": input}
    const options = {
        method: "POST", 
        body: JSON.stringify(sendData),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : 'http://localhost:8080/book',
            'Access-Control-Allow-Credentials' : 'true'
            }
    }
    fetch('http://localhost:8080/book',options)
    .then(response => response.json())
    .then(jsondata => {
        document.getElementById("list").innerHTML = ""
        var templates = {}
        var dataScript = document.getElementById("book-template")
        templates.contactDetails = Handlebars.compile(dataScript.textContent)
        var dataShow;
        for(var i = 0; i < jsondata.length; i++){
            dataShow = templates.contactDetails({
                data : [{
                    id : jsondata[i].work_id,
                    title : jsondata[i].title,
                    author : jsondata[i].author,
                    review :jsondata[i].review
                }]
            })
            document.getElementById("list").innerHTML += dataShow;
        }
    })
}

function sendme(id){
    //console.log("Edw eimai")
    var titlename = document.getElementById("titlename").value;
    var authorname = document.getElementById("authorname").value;
    var review = document.getElementById("review").value;
    console.log(titlename)
    const data = {"work_id": id, "title": titlename, "author": authorname, "review": review}
    var d = JSON.stringify(data)
    const options = {
        method: "PUT", 
        headers : {'Content-type' : 'application/json'},
        body: d
    }
    fetch('http://localhost:8080/send',options)
    alert("The book has edited successfully!")
    window.open("myBooks.html")
}

