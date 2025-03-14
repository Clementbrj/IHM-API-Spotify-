import axios from "axios";
import {useEffect, useState} from "react";

const CreateGroupe = () => {
    const [nom, setNom] = useState("");
    const [taille, setTaille] = useState("");
    const [username, setUsername] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!nom.trim() || !taille.trim()) {
            alert("Veuillez entrer un nom et une taille.");
            return; // Arrête l'exécution ici
        }

        console.log("Données envoyées :", { nameGroupe: nom, taille: Number(taille), name:username });
        try {
            const response = await axios.post("http://localhost:3000/groupes/join", {
                nameGroupe:nom,
                taille: Number(taille),
                name:username,

                //usertoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InB1IiwiaWF0IjoxNzQxODU3MjA0LCJleHAiOjE3NDE4NTc4MDR9.-TmLNtvR7yoZgZWpQ2U5eb-ekLwt313iOmZ3y2keiBw"
            });
            console.log("Réponse serveur :", response.data);
            alert("Groupe créé avec succès !");

            // Réinitialisation du formulaire après succès
            setNom("");
            setTaille("");
        } catch (err) {
            console.error("Erreur lors de la création du groupe :", err);
            alert("Une erreur est survenue.");
        }
    };

    useEffect(() => {
        axios.get("http://localhost:3000/user")
            .then((response) => {
                const localstorage = localStorage.getItem("userinfo");

                if (!localstorage) {
                    console.log("Aucune donnée trouvée dans localStorage");
                    return;
                }

                const dataArray = localstorage.split(",");
                console.log("Données après split :", dataArray);

                // Vérifier que l'index 1 existe
                const name1 = dataArray[1] ? dataArray[1].trim() : "";
                console.log("Nom récupéré :", name1);

                setUsername(name1);

            })
            .catch((error) => {
                console.error("Erreur lors de la requête :", error);
            });
    }, []);


    return (
        <div>
            <form onSubmit={handleFormSubmit} className="row g-3 needs-validation justify-content-center" noValidate>
                <div className="col-md-4">
                    <label htmlFor="nom" className="form-label">Nom du groupe</label>
                    <input
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        name="nom"
                        type="text"
                        className="form-control"
                        id="nom"
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label htmlFor="taille" className="form-label">Taille du groupe</label>
                    <input
                        value={taille}
                        onChange={(e) => setTaille(e.target.value)}
                        name="taille"
                        type="number"
                        className="form-control"
                        id="taille"
                        required
                    />
                </div>

                <div className="col-12">
                    <button className="btn btn-primary" type="submit">
                        Créer un groupe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateGroupe;
