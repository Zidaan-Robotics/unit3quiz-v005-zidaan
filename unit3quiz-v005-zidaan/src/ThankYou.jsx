import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './ThankYou.css';

function ThankYou({ user }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="thank-you-icon">✓</div>
        <h1>Thank You!</h1>
        <p className="welcome-message">
          Welcome, <strong>{user.email}</strong>!
        </p>
        <p className="thank-you-message">
          You have successfully registered to vote. Thank you for your participation!
        </p>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default ThankYou;

