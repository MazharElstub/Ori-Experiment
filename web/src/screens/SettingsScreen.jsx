import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  User,
  SlidersHorizontal,
  LogOut,
  Trash2,
  ChevronRight,
  Info,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

function SettingsRow({ icon: Icon, label, desc, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3.5 px-4 py-3.5 text-left
        transition-colors hover:bg-background
        ${danger ? 'text-danger' : 'text-primary'}
      `}
    >
      <Icon size={20} className={danger ? 'text-danger' : 'text-secondary'} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-danger' : 'text-primary'}`}>{label}</p>
        {desc && <p className="text-xs text-secondary mt-0.5 truncate">{desc}</p>}
      </div>
      {!danger && <ChevronRight size={16} className="text-secondary/50 flex-shrink-0" />}
    </button>
  )
}

export default function SettingsScreen() {
  const { currentUser, name, logout, deleteAccount } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Settings" />

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* Profile section */}
        <Card className="!p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Account</p>
          </div>
          <SettingsRow
            icon={User}
            label={name}
            desc={currentUser?.email}
            onClick={() => {}}
          />
        </Card>

        {/* Preferences section */}
        <Card className="!p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Preferences</p>
          </div>
          <SettingsRow
            icon={SlidersHorizontal}
            label="Ethical priorities"
            desc="Set which issues matter most to you"
            onClick={() => {}}
          />
        </Card>

        {/* About & actions */}
        <Card className="!p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">More</p>
          </div>
          <SettingsRow
            icon={Info}
            label="About ORI"
            desc="Version 1.0.0"
            onClick={() => {}}
          />
          <div className="h-px bg-border/50 mx-4" />
          <SettingsRow
            icon={LogOut}
            label="Log out"
            onClick={logout}
          />
          <div className="h-px bg-border/50 mx-4" />
          {!confirmDelete ? (
            <SettingsRow
              icon={Trash2}
              label="Delete account"
              onClick={() => setConfirmDelete(true)}
              danger
            />
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-secondary mb-3">This cannot be undone. Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-lg bg-background text-sm font-medium text-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  className="flex-1 py-2 rounded-lg bg-danger text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
