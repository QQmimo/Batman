import { Icon } from "../icon/icon";
import styles from "./button.module.scss";

export function Button({ text, disabled, iconSrc, className, onClick }) {
    return (
        <div className={[styles.button, className, disabled ? styles.disabled : null].join(" ")} onClick={onClick}>
            {
                iconSrc &&
                <Icon className={styles.icon} src={iconSrc} />
            }
            <div>{text}</div>
        </div>
    );
}