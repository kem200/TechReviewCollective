import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../store/session';
import './SignupPage.css';

const SignupPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrors(['Passwords do not match']);
            return;
        }
        const user = { username, display_name: displayName, email, password };
        const response = await dispatch(signup(user));
        if (response.ok) {
            navigate('/')
        } else {
            const data = await response.json();
            setErrors(data.errors);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isPasswordValid = password.length >= 6;
    const doPasswordsMatch = password === confirmPassword && password.length > 0;

    return (
        <div className="SignupPage-Main">
            <h1>Signup to TechReviewCollective</h1>
            <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                    <ul className="error-list">
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                )}
                <input
                    type="text"
                    placeholder="Username (at least 4 characters)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email (valid email address)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (at least 6 characters)"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordTouched(true);
                        }}
                        required
                    />
                    <span className="show-password" onClick={toggleShowPassword}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                {passwordTouched && (
                    <div className={`password-hint ${isPasswordValid ? 'valid' : 'invalid'}`}>
                        {isPasswordValid ? 'Password length is sufficient' : 'Password must be at least 6 characters'}
                    </div>
                )}
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordTouched(true);
                        }}
                        required
                    />
                </div>
                {confirmPasswordTouched && (
                    <div className={`password-match ${doPasswordsMatch ? 'match' : 'no-match'}`}>
                        {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                )}
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default SignupPage;
