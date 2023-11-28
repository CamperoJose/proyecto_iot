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
        console.log("Checking IP "+ipv4);
        const device = await this.deviceDao.getDeviceByIp(ipv4);
        if (device) {
            throw new Error('Device already registered');
        }
        console.log("IP not found");
        console.log("Creating device");
        await this.deviceDao.createDevice(name, ipv4, user_id);
        const new_device = await this.deviceDao.getDeviceByIp(ipv4);
        //assign scopes and leds to the device
        //console.log(new_device);
        for (const scope_name of scopes) {
            console.log("Assigning scope "+scope_name);
            const scope = await this.authorizationDao.getScopeByName(scope_name);
            if (!scope) {
                throw new Error('Scope not found');
            }
            console.log("Authorising scope "+scope.SCOPE_ID+"to device "+new_device.DEVICE_ID+"over led "+led);
            await this.authorizationDao.authoriseLedAndScopeToDevice(new_device.DEVICE_ID, led, scope.SCOPE_ID);
        }
        return new_device;
    }

    async countDevices() {
        return await this.deviceDao.countDevices();
    }

    async listAllLeds() {
        return await this.deviceDao.listAllLeds();
    }

    async countLeds() {
        return await this.deviceDao.countLeds();
    }

}

export default DeviceBl;