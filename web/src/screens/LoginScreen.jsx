import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
    <div className="app-shell bg-surface">
      <div className="flex-1 overflow-y-auto p-6 pt-16">
        <h1 className="text-3xl font-bold text-primary">Welcome back</h1>
        <p className="text-base text-secondary mt-1.5 mb-10">Log in to your ORI account</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} className="mt-3">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <button
          onClick={() => navigate('/signup')}
          className="w-full py-4 mt-2 text-sm text-secondary text-center"
        >
          Don't have an account?{' '}
          <span className="text-accent font-semibold">Sign Up</span>
        </button>
      </div>
    </div>
  )
}
