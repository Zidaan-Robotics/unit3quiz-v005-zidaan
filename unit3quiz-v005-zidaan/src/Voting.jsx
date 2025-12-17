import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import './Voting.css';

function Voting({ user }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false to show UI immediately
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkingVote, setCheckingVote] = useState(true);

  useEffect(() => {
    checkIfVoted();
  }, [user]);

  const checkIfVoted = async () => {
    if (!user) {
      setCheckingVote(false);
      return;
    }
    
    try {
      const voteRef = doc(db, 'votes', user.uid);
      const voteSnap = await getDoc(voteRef);
      
      if (voteSnap.exists()) {
        setHasVoted(true);
        setUserVote(voteSnap.data().candidate);
      }
      setCheckingVote(false);
    } catch (error) {
      console.error('Error checking vote:', error);
      // On error, still set checking to false but show error
      setError('please vote');
      setCheckingVote(false);
    }
  };

  const handleVote = async (candidate) => {
    if (!user || hasVoted || checkingVote || submitting) return;
    
    setSubmitting(true);
    setError('');

    try {
      // Save vote to Firestore database
      const voteRef = doc(db, 'votes', user.uid);
      await setDoc(voteRef, {
        candidate: candidate,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date()
      }, { merge: false }); // Use merge: false to ensure we don't overwrite existing votes
      
      // Verify the vote was saved by reading it back
      const savedVote = await getDoc(voteRef);
      if (savedVote.exists()) {
        // Vote successfully saved to database
        setHasVoted(true);
        setUserVote(candidate);
        console.log('Vote successfully saved to Firestore:', savedVote.data());
      } else {
        throw new Error('Vote was not saved to database');
      }
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting vote to database:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Show more detailed error message
      let errorMessage = 'Error saving vote to database. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check Firestore security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Firestore is unavailable. Please check if Firestore is enabled in Firebase Console.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="voting-container">
      <div className="voting-card">
        <h2>Cast Your Vote</h2>
        
        {checkingVote && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#666',
            fontSize: '14px'
          }}>
            Checking vote status...
            <div style={{ 
              marginTop: '10px',
              fontSize: '12px',
              color: '#999',
              fontStyle: 'italic'
            }}>
              This may take up to 30 seconds
            </div>
          </div>
        )}
        
        {hasVoted ? (
          <div className="vote-confirmed">
            <div className="checkmark">✓</div>
            <h3>Thank you for voting!</h3>
            <p className="vote-result">
              You voted for: <strong>{userVote}</strong>
            </p>
            <p className="vote-note">
              Your vote has been recorded. Each account can only vote once.
            </p>
          </div>
        ) : !checkingVote ? (
          <>
            <p className="vote-instruction">
              Please select your candidate:
            </p>
            {error && (
              <div className="error-message" style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '8px',
                border: '1px solid #fcc',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            <div className="vote-options">
              <button
                onClick={() => handleVote('Harris')}
                disabled={submitting || checkingVote}
                className="vote-button harris"
              >
                <span className="candidate-name">Harris</span>
                {submitting && <span className="loading-text">Submitting...</span>}
              </button>
              <button
                onClick={() => handleVote('Trump')}
                disabled={submitting || checkingVote}
                className="vote-button trump"
              >
                <span className="candidate-name">Trump</span>
                {submitting && <span className="loading-text">Submitting...</span>}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Voting;

