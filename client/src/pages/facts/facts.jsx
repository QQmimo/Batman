import { useLayoutEffect, useState } from "react";
import { Requester } from "../../services/requester";
import { Fact } from "../../components/fact/fact";
import styles from "./facts.module.scss";

export function Facts() {
    document.title = "Факты";
    const [fact, setFact] = useState(null);
    const [settings, setSettings] = useState(null);

    useLayoutEffect(() => {
        Requester.get("/api/settings").then(data => {
            startTimer(data.facts);
        });
    }, []);

    const startTimer = (dataSettings) => {
        if (!settings) {
            setSettings(dataSettings);
        }
        Requester.get('/api/fact').then(data => {
            setTimeout(() => {
                setFact(data);
            }, (dataSettings ?? settings).delay * 1000);
        });
    }

    return (
        <div className={styles.page}>
            {
                fact
                    ?
                    <Fact
                        data={fact}
                        showtime={settings.showtime * 1000}
                        onFinish={startTimer} />
                    :
                    null
            }
        </div>
    );
}