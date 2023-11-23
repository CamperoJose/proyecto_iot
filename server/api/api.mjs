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

export default router;