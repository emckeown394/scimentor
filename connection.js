// Connect to database
let mysql  = require('mysql');
const util = require('util');

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

//allow for promises to be used in code (async/await)
db.query = util.promisify(db.query);

module.exports = db;