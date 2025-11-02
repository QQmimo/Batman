const BaseController = require("./BaseController");

class SettingsController extends BaseController {
    constructor() {
        super("./Data/settings.json");
    }

    async getSettings() {
        return new Promise(resolve => {
            resolve(this._Table.data[0]?.value);
        });
    }

    async updateSettings(data) {
        return new Promise(resolve => {
            const updated = { value: data };
            this._update(this._Table.data[0].id, updated);
            resolve();
        });
    }
}

module.exports = SettingsController;