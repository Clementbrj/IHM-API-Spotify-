import axios from "axios";
import {useEffect, useState} from "react";

const SubscribeForm = () => {
    const [name, setName] = useState("");
    const [password, SetPassword] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !password.trim()) {
            alert("Please input a name");
        }
        try {
            await axios.post("http://localhost:3000/users",{name, password})
                .then(response => {
                    console.log(response);
                })
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit} className="row g-3 needs-validation justify-content-center" noValidate>
                <div className="col-md-4">
                    <label htmlFor="validationCustom01" className="form-label">Prénom</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} name="name" type="text" className="form-control" id="validationCustom01" required/>
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <div className="col-md-4">
                    <label htmlFor="validationCustom02" className="form-label">Mot de passe</label>
                    <input value={password} onChange={(e) => SetPassword(e.target.value)} name="password" type="text" className="form-control" id="validationCustom02" required/>
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
            </form>
        </div>
    )
}

export default SubscribeForm