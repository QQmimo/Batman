const express = require("express");
const GamesController = require("./Controllers/GamesController.js");
const ImagesController = require("./Controllers/ImagesController.js");
const path = require("path");

const PORT = 4000;

const server = express();
server.use(express.static("./Data"));
server.use(express.static("./public"));
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));


const gamesController = new GamesController();
const imagesController = new ImagesController();

server.get("/", (req, res) => {
    const root = path.join(__dirname, './public/index.html');
    return res.sendFile(root);
});

server.get("/settings", (req, res) => {
    const root = path.join(__dirname, './public/index.html');
    return res.sendFile(root);
});

server.get("/api/games", async (req, res) => {
    try {
        if (req.query.search) {
            const founded = await gamesController.searchGame(req.query.search);
            return res.status(200).json(founded);
        }
        else if (req.query) {
            const founded = await gamesController.filterGame(req.query);
            return res.status(200).json(founded);
        }

        const allGames = await gamesController.getAllGames();
        return res.status(200).json(allGames);
    }
    catch (er) {
        return res.status(400).json(er);
    }
});

server.get("/api/games:id", async (req, res) => {
    try {
        const id = req.params.id.replace(/[()]/g, '');
        if (isNaN(id)) {
            throw new Error(`Запрос не содержит id как число.`);
        }
        const game = await gamesController.getGame(id);
        return res.status(200).json(game);
    }
    catch (er) {
        return res.status(404).json(er);
    }
});

server.post("/api/games", async (req, res) => {
    try {
        if (req.body === undefined) {
            throw new Error(`У запроса нет данных.`);
        }

        const inserted = await gamesController.addGame(req.body);
        return res.status(200).json(inserted);
    }
    catch (er) {
        return res.status(500).json(er);
    }
});

server.patch("/api/games:id", async (req, res) => {
    try {
        const id = req.params.id.replace(/[()]/g, '');
        if (isNaN(id)) {
            throw new Error(`Запрос не содержит id как число.`);
        }
        const updated = await gamesController.updateGame(id, req.body);
        return res.status(200).json(updated);
    }
    catch (er) {
        return res.status(404).json(er)
    }
});

server.delete("/api/games:id", async (req, res) => {
    try {
        const id = req.params.id.replace(/[()]/g, '');
        if (isNaN(id)) {
            throw new Error(`Запрос не содержит id как число.`);
        }
        const deleted = await gamesController.deleteGame(id);
        await imagesController.deleteImage(deleted.image);
        return res.status(200).json(deleted);
    }
    catch (er) {
        return res.status(400).json(er);
    }
});

server.post("/api/saveimage", async (req, res) => {
    try {
        const fileName = await imagesController.appendImage(req.body);
        return res.status(201).json({ fileName: fileName });
    }
    catch (er) {
        return res.status(400).json(er);
    }
});



server.listen(PORT, () => { console.log(`Server running on: http://localhost:4000`); })