import styles from "./option.module.scss";

export function Option({ id, image, title, platform, status, onSelect }) {
    const style = [
        status === "done" ? styles.done : null,
        status === "in progress" ? styles.progress : null
    ];

    return (
        <div className={[styles.option, ...style].join(" ")} onClick={() => onSelect?.(id)}>
            <div className={styles.image}>
                <img src={image} />
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.platform}>{platform}</div>
        </div>
    );
}