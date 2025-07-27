const BaseController = require("./BaseController");

class GamesController extends BaseController {
    constructor() {
        super("./Data/games.json");
    }

    async getAllGames() {
        return new Promise(resolve => resolve(this._Table));
    }

    async getGame(id) {
        return this._select(id);
    }

    async searchGame(text) {
        return this._Table.data.filter(row => {
            let keys = Object.keys(row);
            keys = keys.filter(k => k !== 'id' && k !== 'created' && k !== 'modified');

            for (const key of keys) {
                if (row[key].toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        });
    }

    async addGame(game) {
        return this._insert(game);
    }

    async updateGame(id, game) {
        return this._update(id, game);
    }

    async deleteGame(id) {
        return this._delete(id);
    }

    async filterGame(filter) {
        let keys = Object.keys(filter);
        keys = keys.filter(k => k !== 'created' && k !== 'modified');
        return this._Table.data.filter(row => keys.length === 0 || keys.reduce((total, key) => total && (filter[key] === 'undefined' ? typeof row[key] === filter[key] : row[key] == filter[key]), true));
    }
}

module.exports = GamesController;