import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppShell from './components/layout/AppShell'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import ExploreScreen from './screens/ExploreScreen'
import SpendingScreen from './screens/SpendingScreen'
import SettingsScreen from './screens/SettingsScreen'

function RootNavigator() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-shell justify-center items-center">
        <div className="w-8 h-8 border-3 border-border border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      {currentUser ? (
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/spending" element={<SpendingScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        <>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RootNavigator />
      </BrowserRouter>
    </AuthProvider>
  )
}
