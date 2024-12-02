import React, { useState, useEffect } from "react";
import "./App.css";
import { missions } from "./missions";

function App() {
    const [score, setScore] = useState(0);
    const [selectedPoints, setSelectedPoints] = useState({});
    const [time, setTime] = useState(150000);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);

    // Show Navbar on Scroll
    useEffect(() => {
        const handleScroll = () => {
            const missionSection = document.querySelector(".missions");
            if (missionSection && window.scrollY > missionSection.offsetTop - 60) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (isTimerActive && time > 0) {
            timer = setInterval(() => setTime(prev => prev - 10), 10);
        }
        return () => clearInterval(timer);
    }, [isTimerActive, time]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const millis = Math.floor((ms % 1000) / 10);
        return `${minutes}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(2, "0")}`;
    };

    const handlePointSelection = (missionId, points) => {
        setSelectedPoints(prev => {
            const updated = { ...prev };
            if (updated[missionId] === points) {
                delete updated[missionId];
            } else {
                updated[missionId] = points;
            }
            setScore(Object.values(updated).reduce((total, point) => total + point, 0));
            return updated;
        });
    };

    return (
        <div className="App">
            <div className={`navbar ${showNavbar ? "visible" : ""}`}>
                <div className="navbar-content">
                    <div className="timer-score-container">
                        <div className="timer">
                            Timer: {formatTime(time)}
                            <div className="timer-buttons">
                                <button
                                    className={`timer-button ${isTimerActive ? "pause" : "start"}`}
                                    onClick={() => setIsTimerActive(!isTimerActive)}
                                >
                                    {isTimerActive ? "Pause" : "Start"}
                                </button>
                                <button
                                    className="timer-button reset"
                                    onClick={() => setTime(150000)}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                        <div className="score">Score: {score}</div>
                    </div>
                </div>
            </div>
            <div className="logo-container">
                <img src="/logo.png" alt="Team Logo" className="team-logo"/>
            </div>
            <div className="top-section">
                <div className="text-container">
                    <h1>Excalibur #6738 FLL Scorer</h1>
                    <p>Track your FLL 2025 performance with ease.</p>
                </div>

            </div>

            <main className="missions">
                <div className="mission-list">
                    {missions.map(mission => (
                        <div key={mission.id} className="mission-item">
                            <h2 className="mission-title">
                                <span className="mission-number">{mission.id}</span>{mission.name}
                            </h2>
                            <div className="mission-points">
                                {mission.points.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`point-option ${selectedPoints[mission.id] === option.value ? "selected" : ""}`}
                                        onClick={() => handlePointSelection(mission.id, option.value)}
                                    >
                                        {option.description}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
