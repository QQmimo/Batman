const fs = require("fs");

class BaseController {
    _Path = null;
    _Table = null;

    constructor(path) {
        this._Path = path;
        this._Table = JSON.parse(fs.readFileSync(this._Path, "utf8"));
    }

    async #reRead() {
        return new Promise(resolve => {
            this._Table = JSON.parse(fs.readFileSync(this._Path, "utf8"));
            resolve();
        });
    }

    async _select(id) {
        return new Promise((resolve, reject) => {
            this.#reRead().then(() => {
                const found = this._Table.data.find(r => r.id == id);
                if (!found) {
                    reject(`Записи с id: ${id} не найдено.`);
                    return;
                }

                resolve(found);
            });
        });
    }

    async _insert(row) {
        return new Promise(resolve => {
            row.id = this._Table.index + 1;
            row.created = new Date();
            row.modified = new Date();
            this._Table.data.push(row);
            this._Table.index += 1;
            this._Table.modified = new Date();
            fs.writeFileSync(this._Path, JSON.stringify(this._Table));
            this.#reRead().then(() => {
                resolve(row);
            });
        });
    }

    async _update(id, row) {
        return new Promise((resolve, reject) => {
            row.id = id;
            row.modified = new Date();
            const found = this._Table.data.find(r => r.id == row.id);
            if (!found) {
                reject(`Записи с id: ${id} не найдено.`);
                return;
            }

            row.created = found.created;
            const rowKeys = Object.keys(row);
            const foundKeys = Object.keys(found);
            for (const key of foundKeys) {
                if (rowKeys.indexOf(key) === -1) {
                    delete found[key];
                }
            }

            for (const key of rowKeys) {
                found[key] = row[key];
            }
            this._Table.modified = new Date();
            fs.writeFileSync(this._Path, JSON.stringify(this._Table));
            this.#reRead().then(() => {
                resolve(row);
            });
        });
    }

    async _delete(id) {
        return new Promise((resolve, reject) => {
            const found = this._Table.data.find(r => r.id == id);
            if (!found) {
                reject(`Записи с id: ${id} не найдено.`);
                return;
            }

            this._Table.data = this._Table.data.filter(r => r.id != id);
            this._Table.modified = new Date();
            fs.writeFileSync(this._Path, JSON.stringify(this._Table));
            this.#reRead().then(() => {
                resolve(found);
            });
        });
    }
}

module.exports = BaseController;