import mysql, {Connection} from 'mysql2/promise';

const connection: Promise<Connection> = mysql.createConnection({
    host: process.env.MYSQL_HOST as string,
    database: process.env.MYSQL_DATABASE as string,
    user: process.env.MYSQL_USER as string,
    password: process.env.MYSQL_PASSWORD as string,
});

export default connection;