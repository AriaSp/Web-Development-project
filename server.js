const { request, response } = require('express');
const express = require('express');
const mysql = require('mysql')

const app = express();
const path = require('path');//gia to path
app.use(express.static(__dirname+'/public'));

const cors = require('cors')
app.use(cors()) // Use this after the variable declaration

app.use(express.urlencoded({ extended:false, limit: '1mb'}))
app.use(express.json({limit: '1mb'}))

//mysql
const con = mysql.createConnection({
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'nodejs_books'
})

var data;
app.post('/books', function(req,res) {
    console.log(req.body);
        res.send(req.body)
        data = req.body;
        //console.log(data)
        var send = {"work_id": data.work_id, "title": data.title, "author": data.author}
        if (data.answer == "ADD"){
            var sql = 'INSERT INTO books SET ?'
            con.query(sql,send,function (err,result){
            console.log("Book added successfully!")
            })
        }
        else if (data.answer == "DELETE"){
            var sql = 'DELETE from books WHERE work_id=?'
            con.query(sql,send.work_id,function (err,result){
            console.log("Book deleted successfully!")
            })
        }
})   


app.get('/',function(req,res){
    res.sendFile('search.html',{root: path.join(__dirname,'public') },
    function(err){
        console.log(err)
    })

})

app.get('/books',function (req,res) {
    var sqlBooks = 'SELECT * FROM books'
    con.query(sqlBooks, function (err,result){
        console.log(result)
        res.send(result);
    })
})

app.post('/book', function(req, res){
    const { searchkey } = req.body;
    console.log("Searchkey was : " + searchkey);

    var sql = "SELECT * FROM books WHERE title LIKE '%" + searchkey + "%' OR author LIKE '%" + searchkey + "%'"
    con.query(sql, function(err, result){
        res.send(result);
    });
})

app.delete('/book/:id', function(req, res){
    const work_id = parseInt(req.params.id);
    
    var sql = "DELETE FROM books WHERE work_id = " + work_id;
    con.query(sql, function (err,result){
        console.log("Book deleted successfully!")
    })
})

app.post('/edit', function(req, res){
    const { work_id } = req.body;
    //console.log(work_id)
    var sql = "SELECT * FROM books WHERE work_id = " + work_id;
    con.query(sql, function (err,result){
        res.send(result);
        console.log("Send data..")
    })
})

app.put('/send', function(req, res){
    var data = req.body
    console.log(data)
    var sql = "UPDATE books SET ? WHERE work_id = "+  data.work_id;
    con.query(sql,data,function (err,result){
        console.log("Book updated successfully!")
    })
})

//Listen on port 8080
app.listen(8080, () => console.log('Listening on port 8080'));

