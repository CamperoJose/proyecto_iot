import connection from "../config/DatabaseConnection.mjs";

class AuthorizationDao {
    constructor() {
        this.connection = connection;
    }

    async authoriseLedAndScopeToDevice(deviceId, ledId, scopeId) {
        const [rows] = await this.connection.promise().query(
            `INSERT INTO AUTHORIZATION (DEVICES_DEVICE_ID, LEDS_LED_ID, SCOPES_SCOPE_ID) VALUES (${deviceId}, ${ledId}, ${scopeId})`);
        return rows;
    }

    async removeAuthorization(deviceId, ledId, scopeId) {
        const [rows] = await this.connection.promise().query(`DELETE FROM AUTHORIZATION WHERE DEVICES_DEVICE_ID = ${deviceId} AND LEDS_LED_ID = ${ledId} AND SCOPES_SCOPE_ID = ${scopeId}`);
        return rows;
    }

    async getScopeByName(scopeName) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM SCOPES WHERE SCOPE_NAME = '${scopeName}'`);
        return rows[0];
    }

}

export default AuthorizationDao;