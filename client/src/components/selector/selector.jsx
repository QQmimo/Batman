import { useEffect, useState } from "react";
import { Button } from "../button/button";
import styles from "./selector.module.scss";

export const Selector = ({ className, options = [], onShowEditor, onDelete }) => {
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        setData(options);
    }, [options]);

    const onChange = (e) => {
        setSelectedId(data[e.currentTarget.selectedIndex].id);
    }

    const onDoubleClick = (e) => {
        onShowEditor?.(selectedId);
    }

    const onAdd = () => {
        setSelectedId(null);
        onShowEditor?.(null);
    }

    const onDel = () => {
        onDelete?.(selectedId);
        setSelectedId(null);
    }

    return (
        <div className={[styles.selector, className].join(' ')}>
            <div className={styles.title}>Факты:</div>
            <div className={styles.controls}>
                <Button text={"Добавить"} onClick={onAdd} />
                <Button text={"Удалить"} onClick={onDel} disabled={selectedId === null} />
            </div>
            <select size={14} className={styles.list} onChange={onChange} onDoubleClick={onDoubleClick}>
                {
                    (data ?? []).map((x) => <option key={`fact_${x.id}`}>{x.value}</option>)
                }
            </select>
        </div>
    );
}