import express from 'express';

import UserBl from '../bl/UserBl.mjs';
import DeviceBl from '../bl/DeviceBl.mjs';
import HActionBl from '../bl/HActionBl.mjs';

const router = express.Router();

// OBTENER USUARIO POR ID
router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const userBl = new UserBl();
    try {
        const user = await userBl.getUserById(id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// CREAR USUARIO
router.post('/register', async (req, res) => {
    const { id_user_admin, name, username, password, administrator} = req.body;
    const userBl = new UserBl();
    try {
        await userBl.createUser(name, username, password, id_user_admin, administrator);
        res.status(200).send('User created successfully');
    } catch (error) {
        res.status(401).send(error.message);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userBl = new UserBl();
    try {
        const authn = await userBl.validateUser(username, password);
        res.status(200).send(authn);
    } catch (error) {
        res.status(403).send(error.message);
    }
});

// LISTAR TODOS LOS USUARIOS
router.get('/users', async (req, res) => {
    const userBl = new UserBl();
    try {
        const users = await userBl.listAllUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// LISTAR DISPOSITIVOS
router.get('/devices', async (req, res) => {
    const deviceBl = new DeviceBl();
    try {
        const devices = await deviceBl.listAllDevices();
        res.status(200).send(devices);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// AÑADIR NUEVO DISPOSITIVO
router.post('/devices', async (req, res) => {
    const { user_id, device_name, ipv4, scopes, led } = req.body;
    const deviceBl = new DeviceBl();
    try {
        const new_device = await deviceBl.createDevice(device_name, ipv4, user_id, scopes, led);
        res.status(200).send(new_device);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// LISTAR TODOS LOS LEDS
router.get('/leds', async (req, res) => {
    const deviceBl = new DeviceBl();
    try {
        const leds = await deviceBl.listAllLeds();
        res.status(200).send(leds);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// OBTENER TODOS LOS ACTION
router.get('/actions', async (req, res) => {
    const hActionBl = new HActionBl();
    try {
        const actions = await hActionBl.getAllActions();
        res.status(200).send(actions);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// CREAR UN NUEVO ACTION
router.post('/actions', async (req, res) => {
    const { description, datetime, ledsLedId, usersUserId } = req.body;
    const hActionBl = new HActionBl();
    try {
        const result = await hActionBl.createHAction(description, datetime, ledsLedId, usersUserId);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// FILTRAR ACTIONS POR USUARIO
router.get('/actions/user/:id', async (req, res) => {
    const id = req.params.id;
    const hActionBl = new HActionBl();
    try {
        const actions = await hActionBl.getActionsByUserId(id);
        res.status(200).send(actions);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// FILTRAR ACTIONS POR LED
router.get('/actions/led/:id', async (req, res) => {
    const id = req.params.id;
    const hActionBl = new HActionBl();
    try {
        const actions = await hActionBl.getActionsByLedId(id);
        res.status(200).send(actions);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// CONTAR DISPOSITIVOS POR USUARIO
router.get('/devices/count', async (req, res) => {
    const deviceBl = new DeviceBl();
    try {
        const devices = await deviceBl.countDevices();
        res.status(200).send(devices);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// CONTAR LEDS TOTALES
router.get('/leds/count', async (req, res) => {
    const deviceBl = new DeviceBl();
    try {
        const devices = await deviceBl.countLeds();
        res.status(200).send(devices);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// ESTE ES EL QUE REALMENTE SE USA PARA EL DASHBOARD
// CONTAR ACCIONES POR LED, USUARIO, AGRUPADO POR DÍA LIMITADO POR FECHA-HORA
router.get('/actions/count', async (req, res) => {
    let { ledId, userId, startDate, endDate } = req.query;
    console.log(startDate);
    console.log(endDate);
    const hActionBl = new HActionBl();
    try {
        const actions = await hActionBl.countActionsByLedAndUser(ledId, userId, startDate, endDate);
        res.status(200).send(actions);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.get('/currentDateTime', (req, res) => {
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    res.status(200).send({ datetime: currentDateTime });
});

export default router;