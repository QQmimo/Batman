import { useEffect, useState } from "react";
import { Icon } from "../icon/icon";
import { Icons } from "../icon/icons";
import styles from "./window.module.scss";

export function Window({ title, children, onClose, withoutCancel = false, isOpen = true, className, fogClassName }) {
    const [effect, setEffect] = useState("");
    const [open, setOpen] = useState(isOpen);
    const [close, setClose] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setEffect(styles.show);
            setClose(false);
        }
        else {
            setClose(true);
        }
    }, [isOpen]);

    useEffect(() => {
        if (close === true) {
            setEffect(styles.hide);
            setTimeout(() => {
                onClose?.();
            }, 200);
        }
    }, [close]);

    return (
        <>
            {
                open &&
                <div className={[styles.fog, fogClassName].join(" ")}>
                    <div className={[styles.window, effect, className].join(" ")}>
                        {
                            (title || !withoutCancel) &&
                            <div className={styles.header}>
                                {
                                    title &&
                                    <div className={styles.title}>{title ?? ""}</div>
                                }
                                {
                                    !withoutCancel &&
                                    <div className={styles.close}>
                                        <Icon src={Icons.Close} onClick={() => setClose(true)} />
                                    </div>
                                }
                            </div>
                        }
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </div >
            }
        </>
    );
}