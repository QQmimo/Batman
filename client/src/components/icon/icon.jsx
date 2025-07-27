import styles from "./icon.module.scss";

export function Icon({ src, className, onClick }) {
    const onError = (e) => {
        e.currentTarget.style.cssText = `background-color: red;`;
    }

    return (
        <img src={src} className={[styles.icon, className].join(' ')} onClick={onClick} onError={onError} />
    );
}