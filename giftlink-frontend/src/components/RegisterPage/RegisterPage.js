import React, { useState } from 'react';

import './RegisterPage.css';

function RegisterPage() {

    //insert code here to create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // insert code here to create handleRegister function and include console.log
    const handleRegister = () => {
        console.log("Register");
    };


    return (
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="register-card p-4 border rounded">
                    <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                    <form>
                        <div className="form-group mt-2 mb-2">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" className="form-control" id="firstName" placeholder='Enter your first name' 
                                value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group mt-2 mb-2">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" className="form-control" id="lastName" placeholder='Enter your last name'
                                    value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        </div>
                        <div className="form-group mt-2 mb-2">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" placeholder='Enter your email' 
                                   value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mt-2 mb-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder='Enter your password' 
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button className="btn btn-primary mt-4" onClick={handleRegister}>Register</button>
                    </form>
                    <p className="mt-4 text-center">
                        Already a member? <a href="/app/login" className="text-primary">Login</a>
                    </p>
                </div>
            </div>
        </div>
    </div>

    )//end of return
}

export default RegisterPage;