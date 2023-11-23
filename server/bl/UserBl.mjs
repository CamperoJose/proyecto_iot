import UserDao from "../dao/UserDao.mjs";

class UserBl {
    constructor() {
        this.userDao = new UserDao();
    }

    async getUserById(id) {
        const user = await this.userDao.getUserById(id);
        if (user) {
            return user;
        }
        throw new Error('User not found');
    }

    async getUserByUsername(username) {
        return await this.userDao.getUserByUsername(username);
    }

    async createUser(name, username, password, creator_id, administrator) {
        const creator_user = await this.userDao.getUserById(creator_id);
        //console.log(Boolean(creator_user.ADMIN[0]));
        if (Boolean(creator_user.ADMIN[0])) {
            await this.userDao.createUser(name, username, password);
            if (administrator) {
                await this.promoteToAdmin(username);
                console.log('User created as admin');
            }
            return;
        }
        throw new Error('Only admins can create users');
    }

    async promoteToAdmin(username) {
        console.log('Promoting user to admin')
        await this.userDao.promoteToAdmin(username);
    }

    async validateUser(username, password) {
        const authn = await this.userDao.validateUser(username, password);
        if (authn) {
            return authn;
        }
        throw new Error('Invalid username or password');
    }
}

export default UserBl;