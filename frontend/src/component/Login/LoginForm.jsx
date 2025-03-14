import React from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from "../context/AuthContext"; // ✅ Vérifie bien ce chemin
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';


// Validation des champs du formulaire avec Yup
const validationSchema = Yup.object().shape({
    prenom: Yup.string()
        .min(2, 'Le prénom doit avoir au moins 2 caractères')
        .required('Prénom obligatoire'),
    password: Yup.string()
        .required('Mot de passe obligatoire'),
});

const LoginForm = () => {
    const { login } = useAuth(); // Fonction login venant du contexte Auth

    const navigate = useNavigate(); // Pour gérer la redirection après connexion réussie

    // Fonction de gestion du formulaire
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            console.log("GTYFqdsygfvseytugrftug",values.password);
            fetch(await login(values.prenom, values.password))
                .then(response => response) // Convertir la réponse en JSON

                .then(data => console.log(data))   // Afficher les données reçues
                .catch(error => console.error('Erreur:', error));
            //const token = await login(values.prenom, values.password).body;

            navigate("/groupe"); // Redirige vers "/groupe" après connexion réussie
        } catch (error) {
            setErrors({ prenom: "Prénom ou mot de passe incorrect" });
            console.error('Erreur lors de la connexion :', error);
        } finally {
            setSubmitting(false);
        }
    };

   /* handleSubmit2().then(r => console.log("dqssg"))*/


    return (
        <div className="container mt-5">
            <Formik
                initialValues={{ prenom: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({
                      handleChange,
                      handleBlur,
                      values,
                      errors,
                      touched,
                      isValid,
                      dirty,
                      isSubmitting,
                  }) => (
                    <Form className="card p-4 shadow-lg">
                        <div className="mb-3">
                            <label htmlFor="prenom" className="form-label">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={values.prenom}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-control ${touched.prenom && errors.prenom ? 'is-invalid' : ''}`}
                            />
                            {touched.prenom && errors.prenom && (
                                <div className="invalid-feedback">{errors.prenom}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                            />
                            {touched.password && errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>
                        <div className="invalid-feedback">{values.prenom}</div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={!isValid || !dirty || isSubmitting}
                        >
                            {isSubmitting ? "Connexion..." : "Se connecter"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );

};

export default LoginForm;
