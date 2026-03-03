import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const USERS_KEY = '@money_tracker_users';
const SESSION_KEY = '@money_tracker_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function getUsers() {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async function saveUsers(users) {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async function restoreSession() {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (raw) setCurrentUser(JSON.parse(raw));
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, name) {
    const users = await getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = { id: Date.now().toString(), email, password, name };
    await saveUsers([...users, newUser]);
    const sessionUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
  }

  async function login(email, password) {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Incorrect email or password.');
    const sessionUser = { id: user.id, email: user.email, name: user.name };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
  }

  async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  async function deleteAccount() {
    const users = await getUsers();
    const updated = users.filter(u => u.id !== currentUser.id);
    await saveUsers(updated);
    await AsyncStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUp, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
