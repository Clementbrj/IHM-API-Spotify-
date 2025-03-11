import React from "react";
import { useState } from "react";

export default function Ihm(){
    const [pseudo, setPseudo] = useState("");

    const connexion = () => {
        if (!pseudo.trim()) return alert("Pseudo requis !");
        window.open(`http://localhost:3000/spotify/connexion?username=${encodeURIComponent(pseudo)}`);
    };

    return (
        <div>
            <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Pseudo" />
            <button onClick={connexion}>Se connecter</button>
        </div>
    );
}