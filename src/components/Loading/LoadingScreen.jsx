import  { useEffect, useState } from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false); // controla el fade-out

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setHidden(true), 300); // Fade out tras 300ms
        }
        return next >= 100 ? 100 : next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (hidden) return null; // evita renderizar de nuevo

  return (
    <div className="loading-screen">
      <img
        src="/assets/interface/loaders/loading-background.svg"
        alt="Fondo de carga"
        className="loading-bg"
      />
      <div className="loading-content">
        <img
          src="/assets/img/logo/logo-loader.svg"
          alt="Logo Atlas"
          className="loading-logo"
        />
        <div className="loading-bar">
          <div
            className="loading-progress"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
