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

    async getActionsByUserId(id) {
        const actions = await this.hActionDao.getActionsByUserId(id);
        if (actions.length > 0) {
            return actions;
        }
        throw new Error('No actions found');
    }

    async getActionsByLedId(id) {
        const actions = await this.hActionDao.getActionsByLedId(id);
        if (actions.length > 0) {
            return actions;
        }
        throw new Error('No actions found');
    }

    async createHAction(description, datetime, ledsLedId, usersUserId) {
        // Aquí podrías agregar lógica adicional, como validaciones o transformaciones.
        console.log("description: "+description);
        console.log("datetime: "+datetime);
        console.log("ledsLedId: "+ledsLedId);
        console.log("usersUserId: "+usersUserId);  
        let result;
        if (datetime === undefined) {
            result = await this.hActionDao.createHActionWODate(description, ledsLedId, usersUserId);
        } else {
            result = await this.hActionDao.createHAction(description, datetime, ledsLedId, usersUserId);
        }
        console.log("result: "+result);       
        if (result.affectedRows > 0) {
            return { message: 'Action created successfully', data: result};
        }
        throw new Error('Error creating action');
    }

    // esto va al dashboard
    async countActionsByLedAndUser(ledId, userId, startDate, endDate) {
        const actions = await this.hActionDao.countActionsByLedAndUser(ledId, userId, startDate, endDate);
        if (actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                //console.log("actions[i].HOUR: "+actions[i].HOUR);
                if (actions[i].HOUR < 10) {
                    //console.log("actions[i].HOUR: "+actions[i].HOUR);
                    actions[i].HOUR = '0' + actions[i].HOUR;
                } else {
                    actions[i].HOUR = actions[i].HOUR + "";
                }
            }
            return actions;
        }
        
        throw new Error('No actions found');
    }

}

export default HActionBl;
