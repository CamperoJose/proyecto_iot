import HActionDao from "../dao/HActionDao.mjs";

class HActionBl {
    constructor() {
        this.hActionDao = new HActionDao();
    }

    async getAllActions() {
        const actions = await this.hActionDao.getAllActions();
        if (actions.length > 0) {
            return actions;
        }
        throw new Error('No actions found');
    }

    async createHAction(description, datetime, ledsLedId, usersUserId) {
        // Aquí podrías agregar lógica adicional, como validaciones o transformaciones.
        const result = await this.hActionDao.createHAction(description, datetime, ledsLedId, usersUserId);
        if (result.affectedRows > 0) {
            return { message: 'Action created successfully' };
        }
        throw new Error('Error creating action');
    }

}

export default HActionBl;
