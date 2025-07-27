import { useEffect, useState } from "react";
import { Option } from "./option";
import { Button } from "../button/button";
import { Icons } from "../icon/icons";
import styles from "./list.module.scss";

export function List({ title, items, onSelect, onAdd }) {
    const [allItems, setAllItems] = useState([]);

    useEffect(() => {
        setAllItems(items);
    }, [items]);

    return (
        <div className={styles.list}>
            <div className={styles.header}>
                <div>
                    {title
                        ? title
                        : <>Всего игр: {allItems.length}</>
                    }
                </div>
                <Button text={"Добавить игру"} iconSrc={Icons.Plus} onClick={onAdd} />
            </div>
            <div className={styles.content}>
                {allItems.map(item => <Option key={item.id} {...item} onSelect={onSelect} />)}
            </div>
        </div>
    );
}