import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("login");
    };

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                <form>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input id="email" placeholder='Enter your email' type='email' className='form-control'
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input id='password' placeholder='Enter your password' type='password' className='form-control'
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className='btn btn-primary' onClick={handleLogin}>Log in</button>
                </form>
                <p className="mt-4 text-center">
                    New here? <a href="/app/register" className="text-primary">Register Here</a>
                </p>

            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;