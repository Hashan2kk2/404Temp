import mysql, {Connection} from 'mysql2/promise';

const connection: Promise<Connection> = mysql.createConnection({
    host: "foftravelsdb.ctayw8u4gk8z.ap-southeast-1.rds.amazonaws.com",
    database: "404travel",
    user: "admin",
    password: "404travels321",
});

export default connection;