import React from 'react'
import { Outlet } from 'react-router-dom'
import TabBar from '../ui/TabBar'

export default function AppShell() {
  return (
    <div className="app-shell bg-background">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <Outlet />
      </div>
      <TabBar />
    </div>
  )
}
