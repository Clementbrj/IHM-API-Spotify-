import React, {useEffect, useState} from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from "../context/AuthContext"; // ✅ Vérifie bien ce chemin
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import axios from "axios";


// Validation des champs du formulaire avec Yup
const validationSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, 'Le prénom doit avoir au moins 2 caractères')
        .required('Prénom obligatoire'),
    password: Yup.string()
        .required('Mot de passe obligatoire'),
});

const LoginForm = () => {
    const { login } = useAuth(); // Fonction login venant du contexte Auth
    const navigate = useNavigate(); // Pour gérer la redirection après connexion réussie
    const [username, setUsername] = useState("");

    // Fonction de gestion du formulaire
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            console.log("GTYFqdsygfvseytugrftug",values.password);
            const token = await login(values.username, values.password);
            console.log("🔑 Token stocké :", token, values.username);
            navigate("/groupe" ); // Redirige vers "/groupe" après connexion réussie
        } catch (error) {
            setErrors({ username: "Prénom ou mot de passe incorrect" });
            console.error('Erreur lors de la connexion :', error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        axios.get("http://localhost:3000/user")
            .then((response) => {
                setUsername(response.data.username);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <div className="container mt-5">
            <Formik
                initialValues={{ username: '', password: '' }}
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
                            <label htmlFor="username" className="form-label">Prénom</label>
                            <input
                                type="text"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                            />
                            {touched.username && errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
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
                        <div className="invalid-feedback">{values.username}</div>
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