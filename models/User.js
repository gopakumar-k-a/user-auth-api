export class User {
    static #users = new Map();
    static #nextId = 1;

    static create({ name, email, age }) {
        const id = this.#nextId++;
        const user = {
            id,
            name,
            email,
            age,
            createdAt: new Date().toISOString()
        };
        
        this.#users.set(id, user);
        return user;
    }

    static findAll() {
        return [...this.#users.values()];
    }

    static findById(id) {
        return this.#users.get(id);
    }

    static findByEmail(email) {
        return [...this.#users.values()].find(user => user.email === email);
    }

    static update(id, updates) {
        const user = this.#users.get(id);
        if (!user) return null;

        const updatedUser = {
            ...user,
            ...updates,
            id: user.id, 
            updatedAt: new Date().toISOString()
        };
        
        this.#users.set(id, updatedUser);
        return updatedUser;
    }

    static delete(id) {
        return this.#users.delete(id);
    }
}