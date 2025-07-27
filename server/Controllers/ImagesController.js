const fs = require("fs");

class ImagesController {
    constructor() {

    }

    async appendImage({ fileName, blob }) {
        return new Promise(resolve => {
            const data = blob.replace(/^data:image\/\w+;base64,/, "");
            const buf = Buffer.from(data, 'base64');
            fs.writeFileSync(`./Data/Images/${fileName}`, buf, { flag: 'w' });
            resolve(`./images/${fileName}`);
        });
    }

    async deleteImage(fileName) {
        return new Promise(resolve => {
            fs.rmSync(fileName.replace("./", "./Data/"), { force: true });
            resolve();
        });
    }
}


module.exports = ImagesController;