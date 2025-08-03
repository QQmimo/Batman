import { useEffect } from "react";
import { useState } from "react";
import { Requester } from "../../services/requester";
import { useRef } from "react";
import { Window } from "../../components/window/window";
import { Button } from "../../components/button/button";
import { Icons } from "../../components/icon/icons";
import styles from "./batman.module.scss";

export function Batman({ isStart = false, update }) {
    document.title = "Рулетка";
    const [start, setStart] = useState(false);
    const [games, setGames] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const scroller = useRef(null);

    useEffect(() => {
        setGames([]);
        setStart(isStart);
    }, [isStart, update]);

    useEffect(() => {
        if (start) {
            setStart(false);
            Requester.get('/api/games?status=undefined').then(data => {
                if (data.length > 0) {
                    const result = [];
                    for (let i = 0; i < 1000; i++) {
                        const x = { ...data[Math.floor(Math.random() * data.length)] };
                        x.hid = `game_${x?.id}_${i}`;
                        result.push(x);
                    }

                    setGames(result);
                    run();
                }
                else {
                    setWinner(
                        <Window className={styles.message} withoutCancel={true}>
                            Нет игр для рулетки.
                        </Window>
                    );
                    setTimeout(() => {
                        setWinner(null);
                        setIsOpen(true);
                    }, 2500);
                }
            });
        }
    }, [start, update]);

    const apply = async (id) => {
        const gamesInProgress = await Requester.get(`/api/games?status=in progress`);
        for (const game of gamesInProgress) {
            game.status = 'done';
            await Requester.patch(`/api/games(${game.id})`, game);
        }
        const game = await Requester.get(`/api/games(${id})`);
        game.status = 'in progress';
        await Requester.patch(`/api/games(${id})`, game);

        setIsOpen(false);
        setWinner(null);
    }

    const run = (maxDistance) => {
        setTimeout(() => {
            const found = Array.from(scroller.current.children)[scroller.current.children.length - 16];
            const rect = found.getBoundingClientRect();
            if (rect.top > 400) {
                const maxSpeed = 3;
                const distance = Math.abs(rect.top - 400);
                maxDistance = maxDistance ?? distance;
                let speed = maxSpeed * (distance / maxDistance) ** 2;
                speed = speed < 0.52 ? 0.52 : speed;
                scroller.current.style.cssText = `top: ${scroller.current.getBoundingClientRect().top - speed}px;`;
                run(maxDistance);
            }
            else {
                found.style.cssText = "color: #74ddf3; text-shadow: 0 0 8px white;";
                isStart = false;
                const id = found.getAttribute('data-id');
                setTimeout(() => {
                    Requester.get(`/api/games(${id})`).then(game => {
                        setWinner(
                            <Window withoutCancel={true} isOpen={isOpen} title={`${game.platform ? `(${game.platform}) ` : ''}${game.title}`}>
                                <img style={{ width: "400px", filter: "drop-shadow(0px 0px 24px black)" }} src={game.image ?? Icons.DefaultLogo} />
                                <Button text={"Принять вызов"} onClick={() => apply(id)} />
                            </Window>
                        );
                    });
                }, 1500);
            }
        }, 1);
    }

    return (
        <>
            <div className={styles.page}></div>
            <div className={styles.fog}></div>
            <div ref={scroller} className={styles.scroller}>
                {
                    games.map((game, i) => (
                        <div className={styles.item} data-id={game?.id} key={game?.hid} id={game?.hid}>
                            <span className={styles.game}>{game?.title}</span>
                            <span className={styles.platform}>{game?.platform}</span>
                        </div>
                    ))
                }
            </div>
            {winner}
        </>
    );
}