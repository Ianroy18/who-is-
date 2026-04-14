import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from './data';
import { GiHolyGrail, GiAngelWings, GiSnake, GiCrossMark, GiCastle } from 'react-icons/gi';
import { FaBookOpen } from 'react-icons/fa';

const CATEGORY_ICONS = {
    "People": GiAngelWings,
    "Places": GiCastle,
    "Events": GiHolyGrail,
    "Objects": GiCrossMark,
    "Miracles": GiSnake,
    "Bible Books": FaBookOpen
};

const COLORS = {
    bg: "bg-gray-950",
    card: "bg-gray-900/80",
    border: "border-gray-800",
    neonPurple: "text-purple-400",
    neonRed: "text-red-500",
    neonGlow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    button: "bg-purple-600 hover:bg-purple-500 active:bg-purple-700",
    danger: "bg-red-600 hover:bg-red-500 active:bg-red-700"
};

function App() {
    const [howToLang, setHowToLang] = useState('en');
    const [gameState, setGameState] = useState('setup');
    const [players, setPlayers] = useState(['', '', '']);
    const [category, setCategory] = useState('');
    const [secretWord, setSecretWord] = useState('');
    const [imposterIndex, setImposterIndex] = useState(null);
    const [revealIndex, setRevealIndex] = useState(0);
    const [hasRevealed, setHasRevealed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [isTimerRunning, timeLeft]);

    const addPlayer = () => {
        if (players.length < 15) setPlayers([...players, '']);
    };

    const removePlayer = (idx) => {
        if (players.length > 3) setPlayers(players.filter((_, i) => i !== idx));
    };

    const updatePlayer = (idx, name) => {
        const newPlayers = [...players];
        newPlayers[idx] = name;
        setPlayers(newPlayers);
    };

    const startGame = () => {
        const validPlayers = players.filter(p => p.trim() !== '');
        if (validPlayers.length < 3) return;

        const categoriesList = Object.keys(CATEGORIES);
        const randomCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)];

        const wordList = CATEGORIES[randomCategory];
        const randomItem = wordList[Math.floor(Math.random() * wordList.length)];
        const randomImposter = Math.floor(Math.random() * validPlayers.length);

        setPlayers(validPlayers);
        setCategory(randomCategory);
        setSecretWord(randomItem);
        setImposterIndex(randomImposter);
        setRevealIndex(0);
        setHasRevealed(false);
        setGameState('reveal');
    };

    const nextReveal = () => {
        setHasRevealed(false);
        if (revealIndex + 1 < players.length) {
            setRevealIndex(revealIndex + 1);
        } else {
            setGameState('play');
            setIsTimerRunning(true);
        }
    };

    const resetGame = () => {
        setGameState('setup');
        setPlayers(['', '', '']);
        setCategory('');
        setSecretWord('');
        setImposterIndex(null);
        setRevealIndex(0);
        setHasRevealed(false);
        setTimeLeft(300);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`min-h-screen ${COLORS.bg} text-gray-100 font-sans p-4 flex items-center justify-center`}>
            <div className="w-full max-w-md mx-auto">
                <AnimatePresence mode="wait">
                    {gameState === 'setup' && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-6 border ${COLORS.border} ${COLORS.neonGlow}`}
                        >
                            <div className="flex justify-center mb-6 mt-2">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="relative"
                                >
                                    <div className={`absolute inset-0 bg-purple-500/20 blur-xl rounded-full`}></div>
                                    <img src="/favicon.svg" alt="Imposter Logo" className="w-24 h-24 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                                </motion.div>
                            </div>
                            <h1 className={`text-4xl font-bold text-center mb-2 ${COLORS.neonPurple}`}>
                                Imposter Who?
                            </h1>
                            <p className="text-center text-gray-400 mb-8 text-sm">
                                Discern the truth in a world of whispers.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setGameState('addPlayers')}
                                    className={`w-full py-4 rounded-xl font-semibold ${COLORS.button} transition-all duration-200 ${COLORS.neonGlow}`}
                                >
                                    Start New Game
                                </button>
                                <button
                                    onClick={() => setGameState('howToPlay')}
                                    className="w-full py-3 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 text-gray-300"
                                >
                                    How to Play
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'howToPlay' && (
                        <motion.div
                            key="howToPlay"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-6 border ${COLORS.border}`}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>

                            <div className="flex justify-center gap-2 mb-4">
                                <button onClick={() => setHowToLang('en')} className={`px-4 py-1 text-xs font-semibold rounded-full transition-all ${howToLang === 'en' ? COLORS.button : 'bg-gray-800 text-gray-400'}`}>English</button>
                                <button onClick={() => setHowToLang('tl')} className={`px-4 py-1 text-xs font-semibold rounded-full transition-all ${howToLang === 'tl' ? COLORS.button : 'bg-gray-800 text-gray-400'}`}>Tagalog</button>
                                <button onClick={() => setHowToLang('ceb')} className={`px-4 py-1 text-xs font-semibold rounded-full transition-all ${howToLang === 'ceb' ? COLORS.button : 'bg-gray-800 text-gray-400'}`}>Bisaya</button>
                            </div>

                            <div className="space-y-4 text-sm text-gray-300 max-h-72 overflow-y-auto pr-2">
                                {howToLang === 'en' && <>
                                    <p className="font-semibold text-purple-400">Who's the imposter among your friends?</p>
                                    <p>Imposter is the ultimate party game of bluffing, guessing, and social deduction. Grab 3-15 friends, sit around one device, and find out who’s lying.</p>
                                    <div className="mt-2 text-gray-200">
                                        <p><strong>1-</strong> All players see the same secret word—except one.</p>
                                        <p><strong>2-</strong> The imposter only receives a vague hint.</p>
                                        <p><strong>3-</strong> One by one, players say a word related to the secret word.</p>
                                        <p><strong>4-</strong> The imposter must fake it and try to blend in without knowing the word.</p>
                                        <p><strong>5-</strong> Keep giving words and talking until someone thinks they've figured it out.</p>
                                    </div>
                                    <p className="mt-2 italic text-purple-300">Fun, fast, and full of suspicion—perfect for game nights, road trips, or hanging out with friends.</p>
                                </>}
                                {howToLang === 'tl' && <>
                                    <p className="font-semibold text-purple-400">Sino ang imposter sa magkakaibigan?</p>
                                    <p>Ang Imposter ay isang party game ng pag-bluff, panghuhula, at social deduction. Mag-aya ng 3-15 na kaibigan, umupo paikot sa isang device, at alamin kung sino ang nagsisinungaling.</p>
                                    <div className="mt-2 text-gray-200">
                                        <p><strong>1-</strong> Lahat ng manlalaro ay makikita ang iisang sikretong salita—maliban sa isa.</p>
                                        <p><strong>2-</strong> Ang imposter ay makakatanggap lamang ng maliit na hint.</p>
                                        <p><strong>3-</strong> Isa-isa, ang mga manlalaro ay magsasabi ng isang salita na konektado sa sikretong salita.</p>
                                        <p><strong>4-</strong> Kailangang magpanggap ng imposter at sumabay nang hindi alam ang totoong salita.</p>
                                        <p><strong>5-</strong> Ipagpatuloy ang pagbibigay ng salita at pag-uusap hanggang sa may makahula kung sino siya.</p>
                                    </div>
                                    <p className="mt-2 italic text-purple-300">Masaya, mabilis, at puno ng suspetsa—perpekto para sa game nights, road trips, o tambay kasama ang barkada.</p>
                                </>}
                                {howToLang === 'ceb' && <>
                                    <p className="font-semibold text-purple-400">Kinsa ang imposter sa inyong barkada?</p>
                                    <p>Ang Imposter kay ang ultimate party game sa binotbotay, tag-anay, ug social deduction. Pag-uban og 3-15 ka barkada, lingkod palibot sa isa ka device, ug hibal-a kung kinsa ang namakak.</p>
                                    <div className="mt-2 text-gray-200">
                                        <p><strong>1-</strong> Tanan players makakita sa same na sekreto na word—lahi lang sa isa.</p>
                                        <p><strong>2-</strong> Ang imposter kay makadawat ra og gamay na hint.</p>
                                        <p><strong>3-</strong> Puli-puli, ang mga players kay mosulti og usa ka word na related sa sekreto na word.</p>
                                        <p><strong>4-</strong> Ang imposter kay kailangan mag-patoo-too ug mosabay bisan wala siya kabalo sa saktong word.</p>
                                        <p><strong>5-</strong> Padayon sa paghatag og words ug pag-estorya hantod sa naay maka-tag-an kung kinsa siya.</p>
                                    </div>
                                    <p className="mt-2 italic text-purple-300">Lingaw, paspas, ug puno sa pagduda—perpekto para sa game nights, road trips, o pag-tambay uban sa barkada.</p>
                                </>}
                            </div>
                            <button
                                onClick={() => setGameState('setup')}
                                className="w-full py-3 mt-6 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 text-gray-300"
                            >
                                Back to Home
                            </button>
                        </motion.div>
                    )}


                    {gameState === 'category' && (
                        <motion.div
                            key="category"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-6 border ${COLORS.border}`}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-center">Select Category</h2>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {Object.keys(CATEGORIES).map((cat) => {
                                    const Icon = CATEGORY_ICONS[cat];
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setGameState('addPlayers');
                                            }}
                                            className={`p-4 rounded-xl border ${COLORS.border} hover:border-purple-500 transition-all flex flex-col items-center gap-2 bg-gray-800/50 hover:bg-gray-800`}
                                        >
                                            <Icon className={`text-3xl ${COLORS.neonPurple}`} />
                                            <span className="text-sm font-medium">{cat}</span>
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => {
                                        const categories = Object.keys(CATEGORIES);
                                        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                                        setCategory(randomCategory);
                                        setGameState('addPlayers');
                                    }}
                                    className={`p-4 rounded-xl border ${COLORS.border} hover:border-purple-500 transition-all flex flex-col items-center gap-2 bg-gray-800/50 hover:bg-gray-800`}
                                >
                                    <span className={`text-3xl ${COLORS.neonPurple}`}>🎲</span>
                                    <span className="text-sm font-medium">Random</span>
                                </button>
                            </div>
                            <button
                                onClick={() => setGameState('setup')}
                                className="w-full py-2 text-gray-400 text-sm"
                            >
                                Back
                            </button>
                        </motion.div>
                    )}

                    {gameState === 'addPlayers' && (
                        <motion.div
                            key="addPlayers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-6 border ${COLORS.border}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Add Players</h2>
                                <span className={`text-xs px-2 py-1 rounded-full bg-purple-900/50 ${COLORS.neonPurple}`}>
                                    {category}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                                {players.map((player, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={player}
                                            onChange={(e) => updatePlayer(idx, e.target.value)}
                                            placeholder={`Player ${idx + 1}`}
                                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                                        />
                                        {players.length > 3 && (
                                            <button
                                                onClick={() => removePlayer(idx)}
                                                className={`px-3 rounded-lg ${COLORS.danger} text-sm`}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={addPlayer}
                                    disabled={players.length >= 15}
                                    className="flex-1 py-3 rounded-lg bg-gray-800 border border-gray-700 text-sm disabled:opacity-50"
                                >
                                    + Add Player ({players.length}/15)
                                </button>
                            </div>

                            <button
                                onClick={startGame}
                                disabled={players.filter(p => p.trim()).length < 3}
                                className={`w-full py-4 rounded-xl font-semibold ${COLORS.button} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Start Reveal Phase
                            </button>
                            <button
                                onClick={() => setGameState('category')}
                                className="w-full py-2 text-gray-400 text-sm mt-2"
                            >
                                Back
                            </button>
                        </motion.div>
                    )}

                    {gameState === 'reveal' && (
                        <motion.div
                            key={`reveal-${revealIndex}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-8 border ${COLORS.border} ${COLORS.neonGlow} min-h- flex flex-col justify-center`}
                        >
                            <div className="text-center mb-6">
                                <p className="text-gray-400 text-sm mb-1">Pass device to</p>
                                <h2 className="text-3xl font-bold">{players[revealIndex]}</h2>
                                <p className="text-gray-500 text-xs mt-1">
                                    {revealIndex + 1} of {players.length}
                                </p>
                            </div>

                            <AnimatePresence mode="wait">
                                {!hasRevealed ? (
                                    <motion.div
                                        key="tap"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex items-center justify-center"
                                    >
                                        <button
                                            onClick={() => setHasRevealed(true)}
                                            className={`w-48 h-48 rounded-full ${COLORS.button} font-bold text-lg ${COLORS.neonGlow} active:scale-95 transition-transform`}
                                        >
                                            Tap to Reveal
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="word"
                                        initial={{ opacity: 0, rotateY: 90 }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center"
                                    >
                                        <div className={`text-center p-8 rounded-xl border-2 ${revealIndex === imposterIndex ? 'border-red-500 bg-red-950/30' : 'border-purple-500 bg-purple-950/30'} mb-6 w-full`}>
                                            {revealIndex === imposterIndex ? (
                                                <>
                                                    <p className={`text-sm mb-2 ${COLORS.neonRed}`}>You are the</p>
                                                    <p className={`text-4xl font-bold ${COLORS.neonRed}`}>IMPOSTER</p>
                                                    <p className="text-xs text-gray-400 mt-4">Blend in. Don't get caught.</p>
                                                    <div className="mt-4 p-3 bg-red-900/40 rounded-lg border border-red-500/30 inline-block">
                                                        <p className="text-sm font-medium text-red-300">
                                                            <span className="font-bold">Hint:</span> {secretWord.h}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm mb-2 text-gray-400">The secret word is</p>
                                                    <p className={`text-4xl font-bold ${COLORS.neonPurple}`}>{secretWord.w}</p>

                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={nextReveal}
                                            className={`w-full py-4 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 transition-all`}
                                        >
                                            {revealIndex + 1 < players.length ? 'Pass to Next Player' : 'Start Game'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {gameState === 'play' && (
                        <motion.div
                            key="play"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-6 border ${COLORS.border}`}
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">Game Started</h2>
                                <div className={`text-5xl font-mono font-bold ${timeLeft < 60 ? COLORS.neonRed : COLORS.neonPurple}`}>
                                    {formatTime(timeLeft)}
                                </div>

                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-3">Turn Order:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {players.map((player, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
                                        >
                                            {idx + 1}. {player}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className={`w-full py-3 rounded-lg font-medium ${COLORS.button}`}
                                >
                                    {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                                </button>
                                <button
                                    onClick={() => setGameState('over')}
                                    className={`w-full py-3 rounded-lg font-medium ${COLORS.danger}`}
                                >
                                    End Round & Reveal Imposter
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'over' && (
                        <motion.div
                            key="over"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`${COLORS.card} backdrop-blur-md rounded-2xl p-8 border ${COLORS.border} ${COLORS.neonGlow}`}
                        >
                            <h2 className="text-3xl font-bold text-center mb-6">Game Over</h2>

                            <div className="text-center mb-6 p-6 rounded-xl bg-red-950/30 border-2 border-red-500">
                                <p className="text-sm text-gray-400 mb-2">The Imposter was</p>
                                <p className={`text-4xl font-bold ${COLORS.neonRed}`}>{players[imposterIndex]}</p>
                            </div>

                            <div className="text-center mb-8 p-4 rounded-xl bg-purple-950/30 border border-purple-500">
                                <p className="text-sm text-gray-400 mb-1">The Secret Word</p>
                                <p className={`text-2xl font-bold ${COLORS.neonPurple}`}>{secretWord.w}</p>
                                {secretWord.k && (
                                    <div className="mt-4 pt-4 border-t border-purple-500/30">
                                        <p className="text-xs text-purple-300 font-semibold mb-1 uppercase tracking-widest">Did you know?</p>
                                        <p className="text-sm text-gray-300 leading-relaxed italic">"{secretWord.k}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => startGame()}
                                    className={`w-full py-4 rounded-xl font-semibold ${COLORS.button} ${COLORS.neonGlow}`}
                                >
                                    Play Again.
                                </button>
                                <button
                                    onClick={() => setGameState('setup')}
                                    className={`w-full py-3 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 text-gray-300`}
                                >
                                    Quit the Game
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mt-12 text-gray-500 text-xs tracking-wider uppercase font-semibold">
                    <span className="text-purple-500/50">Created by Kuya Ianroy</span>
                </div>
            </div>
        </div>
    );
}

export default App;