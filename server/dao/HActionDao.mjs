
import connection from "../config/DatabaseConnection.mjs";

class HActionDao {
    constructor() {
        this.connection = connection;
    }

    async getActionById(id) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM H_ACTION WHERE ACTION_ID = ${id}`);
        return rows[0];
    }

    async createHAction(description, datetime, ledsLedId, usersUserId) {
        const [rows] = await this.connection.promise().query(`INSERT INTO H_ACTION (DESCRIPTION, DATETIME, LEDS_LED_ID, USERS_USER_ID) VALUES ('${description}', '${datetime}', ${ledsLedId}, ${usersUserId})`);
        return rows;
    }

    async updateHAction(actionId, description, datetime, ledsLedId, usersUserId) {
        const [rows] = await this.connection.promise().query(`UPDATE H_ACTION SET DESCRIPTION = '${description}', DATETIME = '${datetime}', LEDS_LED_ID = ${ledsLedId}, USERS_USER_ID = ${usersUserId} WHERE ACTION_ID = ${actionId}`);
        return rows;
    }

    async deleteHAction(actionId) {
        const [rows] = await this.connection.promise().query(`DELETE FROM H_ACTION WHERE ACTION_ID = ${actionId}`);
        return rows;
    }

    async getAllActions() {
        const [rows] = await this.connection.promise().query(`SELECT * FROM H_ACTION`);
        return rows;
    }

    // Aquí puedes añadir otros métodos que consideres necesarios para la gestión de acciones.
}

export default HActionDao;

