import { useEffect, useState } from "react";
import { Requester } from "../../services/requester";
import { List } from "../../components/list/list";
import styles from "./search.module.scss";

export function Search({ search, onSelect }) {
    const [result, setResult] = useState([]);

    useEffect(() => {
        Requester.get(`/api/games?search=${search}`).then(data => {
            setResult(data);
        });
    }, [search]);

    return (
        <div className={styles.page}>
            <List title={`Всего найдено: ${result.length}`} items={result} onSelect={onSelect} />
        </div>
    );
}