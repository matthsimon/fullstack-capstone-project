import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import urlConfig from '../../config';
import { useAuthContext } from '../../context/AuthContext';

import './LoginPage.css';

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);

    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuthContext();

    useEffect(() => {
      if (sessionStorage.getItem('token')) {
        navigate('/app');
      }
    }, [navigate]);

    const handleLogin = async (e) => {
      e.preventDefault();
      fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': email,
          'password': password,
        })
      })
      .then(resp => {
        if (!resp.ok) {
          if (resp.status === 401) setWrongPassword(true);
          throw new Error("Login failed");
        }

        setWrongPassword(false);
        return resp.json();
      })
      .then(data => {
        sessionStorage.setItem('name', data.firstName)
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('token', data.authtoken);
        setIsLoggedIn(true);
        navigate('/app');
      })
      .catch(err => {
        setEmail("");
        setPassword("");
        console.error(err);
      });
    };

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>
              {wrongPassword && (
                <div className='alert alert-danger'>Password doesn't match records</div>
              )}
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