import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// 🛡️ Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Must contain at least one special character')
        .required('Password is required'),
});

const LoginForm = ({ onSubmit }) => {
    return (
        <div className="container mt-5">
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      values,
                      errors,
                      touched,
                      isValid,
                      dirty,
                  }) => (
                    <Form onSubmit={handleSubmit} className="card p-4 shadow-lg">
                        {/* Champ email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.email && errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>

                        {/* Champ mot de passe */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.password && errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>

                        {/* Bouton de soumission */}
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={!isValid || !dirty}
                        >
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginForm;
