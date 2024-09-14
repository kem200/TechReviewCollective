import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('LoginPage component rendered');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const result = await dispatch(sessionActions.login({ credential, password }));
        if (result.success) {
            navigate('/');
        } else {
            setErrors(Object.values(result.errors)); // Convert error object to array
        }
    }

    const handleDemoLogin = async (e) => {
        e.preventDefault();
        setErrors([]);
        const result = await dispatch(sessionActions.login({ credential: 'demo', password: 'password' }));
        if (result.success) {
            navigate('/');
        } else {
            setErrors(Object.values(result.errors)); // Convert error object to array
        }
    }

    return (
       <div className='LoginPage-Main'>
            <h1>Login to TechReviewCollective</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <input
                    type='text'
                    placeholder='Username or Email'
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type='submit'>Log In</button>
                <button type='button' onClick={handleDemoLogin}>Demo User</button>
            </form>
       </div>
    )
}

export default LoginPage;
