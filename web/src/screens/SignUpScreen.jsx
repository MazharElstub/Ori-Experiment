import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUpScreen() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signUp(email.trim().toLowerCase(), password, name.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell" style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingTop: 48 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1C1C1E', marginBottom: 6 }}>Create Account</h1>
        <p style={{ fontSize: 17, color: '#8E8E93', marginBottom: 32 }}>Start tracking your money today</p>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Field label="Full Name">
            <input style={inputStyle} placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email">
            <input style={inputStyle} placeholder="jane@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="Password">
            <input style={inputStyle} placeholder="Min. 6 characters" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
          </Field>
          <Field label="Confirm Password">
            <input style={inputStyle} placeholder="Re-enter your password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          </Field>

          {error && <p style={{ fontSize: 14, color: '#FF3B30', textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#007AFF', borderRadius: 14, paddingBlock: 16, color: '#FFF', fontSize: 17, fontWeight: 600, opacity: loading ? 0.6 : 1, marginTop: 12 }}
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          style={{ width: '100%', paddingBlock: 16, marginTop: 8, color: '#8E8E93', fontSize: 15, textAlign: 'center' }}
        >
          Already have an account? <span style={{ color: '#007AFF', fontWeight: 600 }}>Log In</span>
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
