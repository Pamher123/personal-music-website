import mysql from 'mysql';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123123',
    database: 'yuemiao'
});

const querySql = (sql, params = null, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            connection.query(sql, params, (err, results) => {
                console.log(results);
                callback(err, results);
                connection.release();
            });
        }
    });
};

export default {
    querySql
};
