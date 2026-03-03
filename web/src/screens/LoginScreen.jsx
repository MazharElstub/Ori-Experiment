import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell" style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingTop: 60 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1C1C1E', marginBottom: 6 }}>Welcome Back</h1>
        <p style={{ fontSize: 17, color: '#8E8E93', marginBottom: 40 }}>Log in to your ORI account</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Field label="Email">
            <input style={inputStyle} placeholder="jane@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="Password">
            <input style={inputStyle} placeholder="Your password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>

          {error && <p style={{ fontSize: 14, color: '#FF3B30', textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#007AFF', borderRadius: 14, paddingBlock: 16, color: '#FFF', fontSize: 17, fontWeight: 600, opacity: loading ? 0.6 : 1, marginTop: 12 }}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <button
          onClick={() => navigate('/signup')}
          style={{ width: '100%', paddingBlock: 16, marginTop: 8, color: '#8E8E93', fontSize: 15, textAlign: 'center' }}
        >
          Don't have an account? <span style={{ color: '#007AFF', fontWeight: 600 }}>Sign Up</span>
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 15, fontWeight: 500, color: '#1C1C1E' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  backgroundColor: '#F2F2F7',
  borderRadius: 10,
  paddingInline: 16,
  paddingBlock: 14,
  fontSize: 17,
  color: '#1C1C1E',
  border: 'none',
  width: '100%',
}
