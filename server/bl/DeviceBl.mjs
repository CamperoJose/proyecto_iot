import DeviceDao from "../dao/DeviceDao.mjs";
import AuthorizationDao from "../dao/AuthorizationDao.mjs";

class DeviceBl {
    constructor() {
        this.deviceDao = new DeviceDao();
        this.authorizationDao = new AuthorizationDao();
    }

    async listAllDevices() {
        return await this.deviceDao.listAllDevices();
    }

    async getDeviceById(id) {
        const device = await this.deviceDao.getDeviceById(id);
        if (device) {
            return device;
        }
        throw new Error('Device not found');
    }

    async createDevice(name, ipv4, user_id, scopes, led) {
        //Check if a device with the same IP is already registered
        const device = await this.deviceDao.getDeviceByIp(ipv4);
        if (device) {
            throw new Error('Device already registered');
        }
        const new_device = await this.deviceDao.createDevice(name, ipv4, user_id);
        //assign scopes and leds to the device
        //console.log(new_device);
        for (const scope_name of scopes) {
            const scope = await this.authorizationDao.getScopeByName(scope_name);
            if (!scope) {
                throw new Error('Scope not found');
            }
            await this.authorizationDao.authoriseLedAndScopeToDevice(new_device.DEVICE_ID, led, scope);
        }
        return new_device;
    }

}

export default DeviceBl;