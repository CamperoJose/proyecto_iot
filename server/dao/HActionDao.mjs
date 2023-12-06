
import connection from "../config/DatabaseConnection.mjs";

class HActionDao {
    constructor() {
        this.connection = connection;
    }

    async getActionById(id) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM H_ACTION WHERE ACTION_ID = ${id}`);
        return rows[0];
    }

    async getActionsByUserId(id) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM H_ACTION WHERE USERS_USER_ID = ${id}`);
        return rows;
    }

    async getActionsByLedId(id) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM H_ACTION WHERE LEDS_LED_ID = ${id}`);
        return rows;
    }

    async createHActionWODate(description, ledsLedId, usersUserId) {
        const [rows] = await this.connection.promise().query(`INSERT INTO H_ACTION (DESCRIPTION, DATETIME, LEDS_LED_ID, USERS_USER_ID) VALUES ('${description}', DATE_SUB(NOW(), INTERVAL 4 HOUR), ${ledsLedId}, ${usersUserId})`);
        return rows;
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

    // esto va al dashboard
    async countActionsByLedAndUser(ledId, userId, startDate, endDate) {
        let q = "SELECT DATE_FORMAT(DATETIME, '%Y-%m-%d') AS DATE, HOUR(DATETIME) AS HOUR";
        if (ledId !== undefined) {
            q += ", LED_NAME";
        }
        if (userId !== undefined) {
            q += ", USERNAME";
        }
        q += ", COUNT(ACTION_ID) AS COUNT FROM H_ACTION INNER JOIN LEDS ON LEDS_LED_ID = LED_ID INNER JOIN USERS ON USERS_USER_ID = USER_ID WHERE";
        if (ledId !== undefined) {
            q += ` LED_ID = ${ledId} AND`;
        } 
        if (userId !== undefined) {
            q += ` USER_ID = ${userId} AND`;
        }
        if (startDate !== undefined && endDate !== undefined) {
            q += ` DATETIME BETWEEN '${startDate}' AND '${endDate}'`;
        } else {
            q += " DATETIME BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()";
        }

        q += " GROUP BY DATE, HOUR(DATETIME)";
        if (ledId !== undefined) {
            q += ", LED_NAME";
        }
        if (userId !== undefined) {
            q += ", USERNAME";
        }
        q += " ORDER BY DATE, HOUR(DATETIME)";
        console.log(q);
        const [rows] = await this.connection.promise().query(q);
        return rows;
    }

    async summaryActionsByLedAndUser(){
        let q = "SELECT ROW_NUMBER() OVER (ORDER BY DATETIME) AS NRO, DATE_FORMAT(DATETIME, '%Y-%m-%d') AS DATE, TIME_FORMAT(DATETIME, '%H:%i:%s') AS TIME, LED_NAME, NAME, ADMIN, DESCRIPTION FROM H_ACTION INNER JOIN LEDS ON LEDS_LED_ID = LED_ID INNER JOIN USERS ON USERS_USER_ID = USER_ID ORDER BY DATETIME";
        console.log(q);
        const [rows] = await this.connection.promise().query(q);
        return rows;
    }

}

export default HActionDao;

