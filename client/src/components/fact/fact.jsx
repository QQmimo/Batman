import { useEffect, useState } from "react";
import styles from "./fact.module.scss";

export function Fact({ data, showtime, onFinish }) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowContent(true);
        }, 100);

        setTimeout(() => {
            setShowContent(false);
            onFinish?.();
        }, showtime);
    }, [data]);

    if (data === null) {
        return null;
    }

    return (
        <div className={[styles.fact, showContent ? styles.show : styles.hidden].join(' ')}>
            <img src={data.game.image ?? "/images/default.svg"} className={styles.image} />
            <div className={styles.content}>
                <div className={styles.title}>
                    <div className={styles.game}>
                        {data.game.title}
                    </div>
                    <div className={styles.platform}>
                        {
                            data.game.platform
                                ?
                                <> {data.game.platform}</>
                                :
                                null
                        }
                    </div>
                </div>
                <div className={styles.description}>
                    {data.fact.value.length > 240 ? `${data.fact.value.substring(0, 237)}...` : data.fact.value}
                </div>
            </div>
        </div>
    );
}