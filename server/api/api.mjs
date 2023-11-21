import express from 'express';

import UserBl from '../bl/UserBl.mjs';

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

export default router;