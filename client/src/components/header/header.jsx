import { useEffect, useState } from "react";
import { Icon } from "../icon/icon";
import { Icons } from "../icon/icons";
import { Filter } from "../filter/filter";
import { Requester } from "../../services/requester";
import { Button } from "../button/button";
import styles from "./header.module.scss";

export function Header({ title, autohide = false, showTools = false, onSearch, onFilter, onStart }) {
    const [settings, setSettings] = useState(null);
    const [filter, setFilter] = useState({});
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        Requester.get('/api/settings').then(settings => {
            Requester.get(`/api/games`).then(games => {
                games = games.map(game => game.platform)
                    .filter(platform => platform)
                    .filter((p, i, a) => a.indexOf(p) === i)
                    .map(p => ({ value: p, title: p }))
                    .sort((a, b) => a.title - b.title);
                games = [{ value: "-1", title: "Без фильтра" }, { value: "-2", title: "Без платформы" }, ...games];
                setPlatforms(games);
                setSettings(settings);
            });
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
        else if (value === "-2") {
            setFilter(prevState => {
                const result = { ...prevState, platform: undefined };
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

    const onSettingsKeyDown = (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.currentTarget.blur();
        }
    }

    const onDistanceBlur = (e) => {
        const data = { ...settings };
        data.distance = Number(e.currentTarget.value);
        Requester.post("/api/settings", data);
    }

    const onShowtimeBlur = (e) => {
        const data = { ...settings };
        data.facts.showtime = Number(e.currentTarget.value);
        Requester.post("/api/settings", data);
    }

    const onDelayBlur = (e) => {
        const data = { ...settings };
        data.facts.delay = Number(e.currentTarget.value);
        Requester.post("/api/settings", data);
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
                        <fieldset className={styles.fieldset}>
                            <legend>Время показа факта (сек):</legend>
                            <input type="number" min={10} max={100} defaultValue={settings?.facts?.showtime} onBlur={onShowtimeBlur} onKeyDown={onSettingsKeyDown} />
                        </fieldset>
                        <fieldset className={styles.fieldset}>
                            <legend>Время между фактами (сек):</legend>
                            <input type="number" min={10} max={100} defaultValue={settings?.facts?.delay} onBlur={onDelayBlur} onKeyDown={onSettingsKeyDown} />
                        </fieldset>
                        <fieldset className={styles.fieldset}>
                            <legend>Дистанция:</legend>
                            <input type="number" min={500} max={100000} defaultValue={settings?.distance} onBlur={onDistanceBlur} onKeyDown={onSettingsKeyDown} />
                        </fieldset>
                        <Filter title={"Фильтр по статусу"} onChange={onFilterStatusApply} options={[
                            { value: 0, title: "Без фильтра" },
                            { value: "done", title: "Пройденые" },
                            { value: "in progress", title: "В процессе" },
                        ]} />
                        <Filter title={"Фильтр по платформам"} onChange={onFilterPlatformApply} options={platforms} />
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