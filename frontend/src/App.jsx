import { useState } from 'react';
import './component/styles/App.css';
import Ihm from './pages/ihm';
import SubscribeForm from './pages/Subscribe';
import LoginForm from "./component/Login/LoginForm";
import Groupe from "./pages/Groupe";
import { AuthProvider } from "./component/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components from react-router-dom for routing

function App() {
    const [count, setCount] = useState(0);

    return (
        // Déplace le Router pour envelopper aussi AuthProvider
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/inscription" element={<SubscribeForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/groupe" element={<Groupe />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;