import styles from "./filter.module.scss";

export function Filter({ title, options, onChange }) {
    return (
        <fieldset className={styles.filter}>
            <legend>{title}</legend>
            <select className={styles.select} onChange={onChange}>
                {options.map(item => <option key={item.value} value={item.value}>{item.title}</option>)}
            </select>
        </fieldset>
    );
}