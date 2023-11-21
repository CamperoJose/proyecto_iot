import connection from "../config/DatabaseConnection.mjs";

class DeviceDao {
    constructor() {
        this.connection = connection;
    }

    async listAllDevices() {
        const [rows] = await this.connection.promise().query('SELECT * FROM DEVICES');
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

}

export default DeviceDao;