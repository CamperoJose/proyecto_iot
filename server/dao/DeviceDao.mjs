import connection from "../config/DatabaseConnection.mjs";

class DeviceDao {
    constructor() {
        this.connection = connection;
    }

    async listAllDevices() {
        const [rows] = await this.connection.promise().query(`
            SELECT 
                D.IPV4, 
                D.USERS_USER_ID, 
                A.LEDS_LED_ID, 
                S.SCOPE_NAME,
                L.ESP_PIN
            FROM 
                DEVICES D
            INNER JOIN 
                AUTHORIZATION A ON D.DEVICE_ID = A.DEVICES_DEVICE_ID
            INNER JOIN 
                SCOPES S ON A.SCOPES_SCOPE_ID = S.SCOPE_ID
            INNER JOIN 
                LEDS L ON A.LEDS_LED_ID = L.LED_ID
        `);


        return rows;
    }

    async getDeviceById(id) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM DEVICES WHERE DEVICE_ID = ${id}`);
        return rows[0];
    }

    async getDeviceByIp(ip) {
        const [rows] = await this.connection.promise().query(`SELECT * FROM DEVICES WHERE IPV4 = '${ip}'`);
        return rows[0];
    }

    async createDevice(name, ipv4, user) {
        const [rows] = await this.connection.promise().query(`INSERT INTO DEVICES (DEVICE_NAME, IPV4, GRANTED_CONN, USERS_USER_ID) VALUES ('${name}', '${ipv4}', 1, ${user})`);
        return rows;
    }

    async countDevices() {
        const [rows] = await this.connection.promise().query(`SELECT USERNAME, COUNT(DEVICES.DEVICE_ID) AS DEVICE_COUNT FROM DEVICES JOIN USERS ON USER_ID = USERS_USER_ID GROUP BY USERNAME`);
        return rows;
    }

    async countLeds() {
        const [rows] = await this.connection.promise().query(`SELECT COUNT(LEDS.LED_ID) AS LED_COUNT FROM LEDS`);
        return rows; 
    }

    async listAllLeds() {
        const [rows] = await this.connection.promise().query(`SELECT * FROM LEDS`);
        return rows;
    }

    async summaryAllDevices() {
        const [rows] = await this.connection.promise().query(`
            SELECT
                D.DEVICE_NAME AS DeviceName,
                D.IPV4 AS DeviceIPv4,
                U.NAME AS OwnerName,
                GROUP_CONCAT(CONCAT(S.SCOPE_NAME, ' ON ', L.LED_NAME) SEPARATOR '; ') AS GrantedScopes
            FROM
                DEVICES D
            JOIN
                USERS U ON D.USERS_USER_ID = U.USER_ID
            LEFT JOIN
                AUTHORIZATION A ON D.DEVICE_ID = A.DEVICES_DEVICE_ID
            LEFT JOIN
                SCOPES S ON A.SCOPES_SCOPE_ID = S.SCOPE_ID
            LEFT JOIN
                LEDS L ON A.LEDS_LED_ID = L.LED_ID
            WHERE
                D.GRANTED_CONN = 1
            GROUP BY
                D.DEVICE_ID
            ORDER BY
                D.DEVICE_NAME ASC;
    
        `);
        return rows;
    }

}

export default DeviceDao;