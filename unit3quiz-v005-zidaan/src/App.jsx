import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Auth from './Auth'
import Voting from './Voting'
import SalesGraph from './SalesGraph'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showVotingModal, setShowVotingModal] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      // Close auth modal when user successfully logs in
      if (currentUser) {
        setShowAuthModal(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          {user ? (
            <>
              <h1 style={{ margin: 0, fontSize: '24px' }}>Welcome, {user.email}!</h1>
              <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                Thank you for your support!
              </p>
            </>
          ) : (
            <h1 style={{ margin: 0, fontSize: '24px' }}>Warehouse and Retail Sales Data</h1>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {user ? (
            <>
              <button 
                onClick={() => setShowVotingModal(true)}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Vote
              </button>
              <button 
                onClick={handleSignOut}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Voting Registration
            </button>
          )}
        </div>
      </header>
      
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowAuthModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001
              }}
            >
              ×
            </button>
            <Auth />
          </div>
        </div>
      )}
      
      {showVotingModal && user && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowVotingModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '20px' }}>
            <button
              onClick={() => setShowVotingModal(false)}
              style={{
                position: 'absolute',
                bottom: '-50px',
                right: '0',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                color: '#333'
              }}
            >
              ×
            </button>
            <Voting user={user} />
          </div>
        </div>
      )}
      
      <SalesGraph />
    </div>
  )
}

export default App
