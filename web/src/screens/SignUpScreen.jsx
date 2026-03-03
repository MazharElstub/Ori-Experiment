import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
    <div className="app-shell bg-surface">
      <div className="flex-1 overflow-y-auto p-6 pt-12">
        <h1 className="text-3xl font-bold text-primary">Create account</h1>
        <p className="text-base text-secondary mt-1.5 mb-8">Start understanding your spending impact</p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <Input
            label="Full Name"
            placeholder="Jane Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} className="mt-3">
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 mt-2 text-sm text-secondary text-center"
        >
          Already have an account?{' '}
          <span className="text-accent font-semibold">Log In</span>
        </button>
      </div>
    </div>
  )
}
