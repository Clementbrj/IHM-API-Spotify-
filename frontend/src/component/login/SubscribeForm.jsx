
const SubscribeForm = () => {

    return (
        <div>
            <form className="row g-3 needs-validation justify-content-center" noValidate>
                <div className="col-md-4">
                    <label htmlFor="validationCustom01" className="form-label">Prénom</label>
                    <input type="text" className="form-control" id="validationCustom01" value="Mark" required/>
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <div className="col-md-4">
                    <label htmlFor="validationCustom02" className="form-label">Mot de passe</label>
                    <input type="text" className="form-control" id="validationCustom02" value="Otto" required/>
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