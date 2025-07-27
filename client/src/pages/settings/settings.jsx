import { useEffect, useState } from "react";
import { List } from "../../components/list/list";
import { Requester } from "../../services/requester";
import { Form } from "../../components/form/form";
import { Icons } from "../../components/icon/icons";
import styles from "./settings.module.scss";

export function Settings({ filter }) {
    document.title = "Настройки";
    const [update, setUpdate] = useState(new Date());
    const [games, setGames] = useState([]);
    const [window, setWindow] = useState(null);

    useEffect(() => {
        const keys = Object.keys(filter);
        Requester.get(`/api/games`).then(all => {
            setGames(all
                .filter(game => keys.length === 0 || keys.reduce((total, key) => total && game[key] == filter[key], true))
                .map(game => ({
                    id: game.id,
                    title: game.title,
                    platform: game.platform,
                    status: game.status,
                    image: game.image ?? Icons.DefaultLogo
                })));
        });
    }, [filter, update]);

    const onCloseWindow = () => {
        setWindow(null);
    }

    const onSelect = (id) => {
        setWindow(
            <Form className={styles.window} gameId={id} onClose={onCloseWindow} onUpdate={setUpdate} />
        );
    }

    const onAdd = () => {
        setWindow(
            <Form className={styles.window} onClose={onCloseWindow} onUpdate={setUpdate} />
        );
    }

    return (
        <div className={styles.page}>
            <List items={games} onSelect={onSelect} onAdd={onAdd} />
            {
                window
            }
        </div>
    );
}