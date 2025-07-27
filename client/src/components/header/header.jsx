import { useEffect, useState } from "react";
import { Icon } from "../icon/icon";
import { Icons } from "../icon/icons";
import { Filter } from "../filter/filter";
import { Requester } from "../../services/requester";
import styles from "./header.module.scss";
import { Button } from "../button/button";

export function Header({ title, autohide = false, showTools = false, onSearch, onFilter, onStart }) {
    const [filter, setFilter] = useState({});
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        Requester.get(`/api/games`).then(games => {
            setPlatforms(games
                .map(game => game.platform)
                .filter(platform => platform)
                .pop({ value: "-1", title: "Без фильтра" })
            );
        });
    }, []);

    useEffect(() => {
        onFilter?.(filter);
    }, [filter]);

    const onKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "NumpadEnter") {
            onSearch?.(e.currentTarget.value);
        }
    }

    const onFilterStatusApply = (e) => {
        const value = e.currentTarget.value;
        if (value == 0) {
            setFilter(prevState => {
                delete prevState.status;
                const result = { ...prevState };
                return result;
            });
        }
        else {
            setFilter(prevState => {
                const result = { ...prevState, status: value };
                return result;
            });
        }
    }

    const onFilterPlatformApply = (e) => {
        const value = e.currentTarget.value;
        if (value === "-1") {
            setFilter(prevState => {
                delete prevState.platform;
                const result = { ...prevState };
                return result;
            });
        }
        else {
            setFilter(prevState => {
                const result = { ...prevState, platform: value };
                return result;
            });
        }
    }

    return (
        <div className={[styles.header, autohide ? styles.hide : ""].join(" ")}>
            <div className={styles.title} onClick={() => location.href = "/"}>
                {title}
            </div>
            <div className={styles.tools}>
                {
                    showTools
                    && <>
                        <Filter title={"Фильтр по статусу"} onChange={onFilterStatusApply} options={[
                            { value: 0, title: "Без фильтра" },
                            { value: "done", title: "Пройденые" },
                            { value: "in progress", title: "В процессе" },
                        ]} />
                        <Filter title={"Фильтр по платформам"} onChange={onFilterPlatformApply} options={platforms.map(p => ({ value: p, title: p }))} />
                        <fieldset className={styles.fieldset}>
                            <legend>Поиск по играм</legend>
                            <input className={styles.search} type={"text"} placeholder="Поиск" onKeyDown={onKeyDown} />
                        </fieldset>
                    </>
                }
                {
                    !showTools
                    && <>
                        <Button className={styles.button} text={"Запустить"} onClick={onStart} />
                    </>
                }
                <div className={styles.settings}>
                    <Icon src={Icons.Settings} onClick={() => location.href = "/settings"} />
                </div>
            </div>
        </div>
    );
}