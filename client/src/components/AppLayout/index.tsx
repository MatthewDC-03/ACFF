import React from 'react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import BottomNav from '../BottomNav'

interface AppLayoutProps {
  navbarChildren?: React.ReactNode
  sidebarChildren?: React.ReactNode
  children: React.ReactNode
}

const AppLayout = ({ navbarChildren, sidebarChildren, children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar>{navbarChildren}</Navbar>

      <div className="flex flex-row flex-1 overflow-hidden mt-[89.09px]">
        <Sidebar>{sidebarChildren}</Sidebar>

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}

export default AppLayout
