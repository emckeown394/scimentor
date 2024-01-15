// Connect to database
let mysql  = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',   
    database: 'scimentor',
    port: '3306' 
});

db.connect((err)=> {
    if(err) throw err;
});

module.exports = db;