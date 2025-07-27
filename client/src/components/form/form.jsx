import { useEffect, useState } from "react";
import { Window } from "../window/window";
import { Requester } from "../../services/requester";
import { ImagePreview } from "../imagepreview/imagepreview";
import { Button } from "../button/button";
import styles from "./form.module.scss";

export function Form({ gameId, onClose, onUpdate, className }) {
    const [game, setGame] = useState({});
    const [open, setOpen] = useState(true);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState(null);
    const [openMessage, setOpenMessage] = useState(true);
    const [blob, setBlob] = useState(null);
    const [gameImage, setGameImage] = useState(null);
    const [id, setId] = useState(gameId);

    useEffect(() => {
        if (id) {
            Requester.get(`/api/games(${id})`).then(g => {
                setGame(g);
                setGameImage(g.image);
            });
        }
    }, [gameId, id]);

    const onImageChange = (value) => {
        setBlob(value);
    }

    const onImageClear = () => {
        setBlob(null);
        setGameImage(null);
    }

    const onTitleChange = (e) => {
        const value = e.currentTarget?.value;
        setGame(prevState => {
            prevState.title = value;
            return { ...prevState };
        });
    }

    const onPlatformChange = (e) => {
        const value = e.currentTarget?.value;
        setGame(prevState => {
            prevState.platform = value;
            return { ...prevState };
        });
    }

    const onStatusChange = (e) => {
        const value = e.currentTarget?.value;
        setGame(prevState => {
            if (value === "not start") {
                delete prevState.status;
            }
            else {
                prevState.status = value ?? undefined;
            }
            return { ...prevState };
        });
    }

    const onCloseMessage = () => {
        setOpenMessage(true);
        setMessage(null);
    }

    const onApproveDelete = async () => {
        await Requester.delete(`/api/games(${id})`);
        setOpenMessage(true);
        setMessage(null);
        setOpen(false);
        onUpdate?.(new Date());
    }

    const onCancelDelete = () => {
        setOpenMessage(true);
        setMessage(null);
    }

    const onDelete = () => {
        setMessage(
            <Window title={"Удаление!"} isOpen={openMessage} onClose={onCloseMessage} >
                <p className={styles.message}>Будет удалена игра: {game?.title}<br />
                    Вы уверены?</p>
                <div className={styles.controls}>
                    <Button text={"Да, удалить"} onClick={onApproveDelete} />
                    <Button text={"Ой, отмена!"} onClick={onCancelDelete} />
                </div>
            </Window>
        );
    }

    const onSave = async () => {
        if (game?.title?.length > 0) {
            let image = null;
            if (id) {
                if (!gameImage) {
                    delete game.image;
                }

                if (blob) {
                    const regExp = new RegExp(/(?:data:(.*?);)+/, "gm");
                    const match = regExp.exec(blob);
                    const type = match[1].split('/')[1];
                    image = `${id}.${type}`;
                    image = await Requester.post(`/api/saveimage`, {
                        fileName: image,
                        blob: blob
                    });
                    game.image = image.fileName;
                }

                await Requester.patch(`/api/games(${id})`, {
                    ...game
                });
            }
            else {
                const added = await Requester.post(`/api/games`, {
                    ...game,
                });

                if (blob) {
                    const regExp = new RegExp(/(?:data:(.*?);)+/, "gm");
                    const match = regExp.exec(blob);
                    const type = match[1].split('/')[1];
                    image = `${added.id}.${type}`;
                    image = await Requester.post(`/api/saveimage`, {
                        fileName: image,
                        blob: blob
                    });

                    if (image?.fileName) {
                        game.image = image?.fileName;
                    }

                    await Requester.patch(`/api/games(${added.id})`, {
                        ...game
                    });
                }
                setId(added.id);
            }
            setStatus(<Window className={styles.notification} withoutCancel={true}>Изменения сохранены.</Window>);
            onUpdate?.(new Date());
            setTimeout(() => {
                setStatus(null);
            }, 1000);
        }
        else {
            setStatus(<Window className={styles.notification} withoutCancel={true}>Нужно ввести хотябы название игры</Window>);
            onUpdate?.(new Date());
            setTimeout(() => {
                setStatus(null);
            }, 1500);
        }
    }

    return (
        <Window className={className} title={game?.title ? game.title : "Новая игра"} onClose={onClose} isOpen={open}>
            <div className={styles.form}>
                <div className={styles.fields}>
                    <div className={styles.field}>
                        <div className={styles.label}>Название:</div>
                        <input className={styles.input} type="text" defaultValue={game?.title} onChange={onTitleChange} />
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Платформа:</div>
                        <input className={styles.input} type="text" defaultValue={game?.platform} onChange={onPlatformChange} />
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Статус игры:</div>
                        <div className={styles.option}>
                            <input className={styles.input} id="no" name={"status"} type="radio" checked={game?.status !== "in progress" && game?.status !== "done"} value={"not start"} title="Не начинал" onChange={onStatusChange} />
                            <label htmlFor="no">Не начинал</label>
                        </div>
                        <div className={styles.option}>
                            <input className={styles.input} id="inprocess" name={"status"} type="radio" checked={game?.status === "in progress"} value={"in progress"} title="В процессе" onChange={onStatusChange} />
                            <label htmlFor="inprocess">В процессе</label>
                        </div>
                        <div className={styles.option}>
                            <input className={styles.input} id="done" name={"status"} type="radio" checked={game?.status === "done"} value={"done"} title="Прошел" onChange={onStatusChange} />
                            <label htmlFor="done">Прошел</label>
                        </div>
                    </div>
                </div>
                <ImagePreview onSelected={onImageChange} onLoaded={onImageChange} onClear={onImageClear} src={game?.image} />
            </div>
            <div className={styles.controls}>
                <Button text={"Удалить"} onClick={onDelete} />
                <Button text={"Сохранить"} onClick={onSave} />
                <Button text={"Закрыть"} onClick={() => setOpen(false)} />
            </div>
            {status}
            {message}
        </Window >
    );
}