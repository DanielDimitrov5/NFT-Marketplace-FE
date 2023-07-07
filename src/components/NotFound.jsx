const NotFound = ({ message }) => {

    return (
        <div className="container">
            <br />
            <div className="row">
                <div className="col-12">
                    <h1>404</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <h2>Page not found</h2>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default NotFound;