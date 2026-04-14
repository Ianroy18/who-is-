import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiHolyGrail, GiAngelWings, GiSnake, GiCrossMark, GiCastle } from 'react-icons/gi';

const CATEGORIES = {
    "People": [
        "Adam", "Eve", "Noah", "Abraham", "Sarah", "Isaac", "Jacob", "Joseph", "Moses", "Aaron",
        "Joshua", "Ruth", "Samuel", "David", "Solomon", "Elijah", "Elisha", "Esther", "Job", "Isaiah",
        "Jeremiah", "Daniel", "Jonah", "Mary", "Joseph", "Peter", "Paul", "John", "Judas", "Luke"
    ],
    "Places": [
        "Eden", "Bethlehem", "Nazareth", "Jerusalem", "Galilee", "Jordan River", "Red Sea", "Sinai",
        "Jericho", "Babylon", "Egypt", "Canaan", "Gethsemane", "Golgotha", "Nineveh", "Damascus",
        "Antioch", "Corinth", "Ephesus", "Rome", "Mount Ararat", "Sodom", "Gomorrah", "Capernaum"
    ],
    "Events": [
        "Creation", "The Flood", "Tower of Babel", "Exodus", "Passover", "Ten Commandments",
        "Fall of Jericho", "David vs Goliath", "Burning Bush", "Parting Red Sea", "Virgin Birth",
        "Baptism of Jesus", "Wedding at Cana", "Last Supper", "Crucifixion", "Resurrection",
        "Ascension", "Pentecost", "Paul's Conversion", "Road to Damascus", "Denial of Peter", "Betrayal"
    ],
    "Objects": [
        "Ark", "Ark of the Covenant", "Manna", "Ten Commandments Tablets", "Bronze Serpent",
        "Goliath's Sword", "Slingshot", "Crown of Thorns", "Cross", "Empty Tomb", "Thirty Pieces of Silver",
        "Seamless Robe", "Fish and Loaves", "Mustard Seed", "Fig Tree", "Burning Bush", "Golden Calf",
        "Scepter", "Lamb", "Dove", "Scroll", "Trumpet"
    ],
    "Miracles": [
        "Parting Red Sea", "Water from Rock", "Manna from Heaven", "Sun Stands Still", "Healing Leper",
        "Blind See", "Lame Walk", "Water to Wine", "Feeding 5000", "Walking on Water", "Calming Storm",
        "Raising Lazarus", "Resurrection", "Coin in Fish", "Withered Fig Tree", "Deaf Hear", "Mute Speak",
        "Casting out Demons", "Shadow Healing", "Handkerchief Healing", "Paul's Viper Bite"
    ]
};

const CATEGORY_ICONS = {
    "People": GiAngelWings,
    "Places": GiCastle,
    "Events": GiHolyGrail,
    "Objects": GiCrossMark,
    "Miracles": GiSnake
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

    // Timer logic
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

        const wordList = CATEGORIES[category];
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        const randomImposter = Math.floor(Math.random() * validPlayers.length);

        setPlayers(validPlayers);
        setSecretWord(randomWord);
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
                            <h1 className={`text-4xl font-bold text-center mb-2 ${COLORS.neonPurple}`}>
                                Imposter Who?
                            </h1>
                            <p className="text-center text-gray-400 mb-8 text-sm">
                                A biblical social deduction game
                            </p>
                            <button
                                onClick={() => setGameState('category')}
                                className={`w-full py-4 rounded-xl font-semibold ${COLORS.button} transition-all duration-200 ${COLORS.neonGlow}`}
                            >
                                Start New Game
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
                                                            <span className="font-bold">Hint:</span> The word is in the <span className="text-red-200 uppercase">{category}</span> category.
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm mb-2 text-gray-400">The secret word is</p>
                                                    <p className={`text-4xl font-bold ${COLORS.neonPurple}`}>{secretWord}</p>
                                                    <p className="text-xs text-gray-400 mt-4">Category: {category}</p>
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
                                <p className="text-xs text-gray-400 mt-2">Category: {category}</p>
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
                                <p className={`text-2xl font-bold ${COLORS.neonPurple}`}>{secretWord}</p>
                            </div>

                            <button
                                onClick={resetGame}
                                className={`w-full py-4 rounded-xl font-semibold ${COLORS.button} ${COLORS.neonGlow}`}
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;