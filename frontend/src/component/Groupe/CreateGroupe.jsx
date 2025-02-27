import axios from "axios";
import { useState } from "react";

const CreateGroupe = () => {
    const [nom, setNom] = useState("");
    const [taille, setTaille] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!nom.trim() || !taille.trim()) {
            alert("Veuillez entrer un nom et une taille.");
            return; // Arrête l'exécution ici
        }

        try {
            const response = await axios.post("http://localhost:3000/groupes/join", {
                groupe: {
                    nom,
                    is_admin: "1",
                    members: [],
                    taille: Number(taille) // Conversion en nombre
                }
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
