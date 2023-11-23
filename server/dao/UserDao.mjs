import connection from "../config/DatabaseConnection.mjs";

class UserDao {
    constructor() {
        this.connection = connection;
    }
    
    async getUserById(id) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM USERS WHERE USER_ID = ${id}`);
        return rows[0];
    }

    async getUserByUsername(username) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM USERS WHERE USERNAME = '${username}'`);
        return rows[0];
    }

    async createUser(name, username, password) {
        const [rows] = await this.connection.promise().query(`INSERT INTO USERS (NAME, USERNAME, PASSWORD, ADMIN) VALUES ('${name}', '${username}', '${password}', 0)`);
        return rows;
    }

    async promoteToAdmin(username) {
        const [rows] = await this.connection.promise().query(`UPDATE USERS SET ADMIN = 1 WHERE USERNAME = '${username}'`);
        return rows;
    }

    async demoteToUser(username) {
        const [rows] = await this.connection.promise().query(`UPDATE USERS SET ADMIN = 0 WHERE USERNAME = '${username}'`);
        return rows;
    }

    async validateUser(username, password) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM USERS WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`); 
        // TODO test this
        return rows[0];
    }
}

export default UserDao;