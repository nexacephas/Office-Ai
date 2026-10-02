import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import type { Theme } from '../../../context/ThemeContext'
import { endTemporarySession, getTemporaryAccount } from '../../../services/authService'
import { getThemePreference, resolveThemePreference, saveThemePreference } from '../../../services/themePreference'
import './Header.css'

interface HeaderProps {
  isSidebarOpen: boolean
  onMenuClick: () => void
}

type HeaderIconName = 'menu' | 'close' | 'search' | 'bell' | 'sun' | 'moon'

function HeaderIcon({ name }: { name: HeaderIconName }) {
  let iconContent: ReactNode

  switch (name) {
    case 'menu':
      iconContent = <path d="M4 7h16M4 12h16M4 17h16" />
      break
    case 'close':
      iconContent = <path d="m6 6 12 12M18 6 6 18" />
      break
    case 'search':
      iconContent = (
        <>
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m16 16 4.5 4.5" />
        </>
      )
      break
    case 'bell':
      iconContent = <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      break
    case 'sun':
      iconContent = (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </>
      )
      break
    case 'moon':
      iconContent = <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
      break
  }

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {iconContent}
      </g>
    </svg>
  )
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/documents/')) return 'Document details'
  if (pathname.startsWith('/tasks/')) return 'Task details'
  if (pathname.startsWith('/knowledge/')) return 'Knowledge source'
  if (pathname.startsWith('/settings')) return 'Settings'

  const titles: Record<string, string> = {
    '/': 'OfficePilot AI',
    '/dashboard': 'Dashboard',
    '/ai': 'AI Assistant',
    '/documents': 'Documents',
    '/tasks': 'Tasks',
    '/registry': 'File Registry',
    '/correspondence': 'Correspondence',
    '/meetings': 'Meetings',
    '/approvals': 'Approvals',
    '/reports': 'Reports',
    '/notifications': 'Notifications',
    '/knowledge': 'Knowledge',
    '/settings': 'Settings',
  }

  return titles[pathname] ?? 'OfficePilot'
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Header({ isSidebarOpen, onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const temporaryAccount = getTemporaryAccount()
  const user = auth?.user ?? (temporaryAccount
    ? { name: temporaryAccount.name, role: 'Administrator' }
    : { name: 'Cephas', role: 'Administrator' })
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const [theme, setTheme] = useState<Theme>(() => resolveThemePreference())
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (getThemePreference() !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => setTheme(media.matches ? 'dark' : 'light')
    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [])

  useEffect(() => {
    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail
      if (nextTheme === 'light' || nextTheme === 'dark') setTheme(nextTheme)
    }
    document.addEventListener('officepilot-theme-change', syncTheme)
    return () => document.removeEventListener('officepilot-theme-change', syncTheme)
  }, [])

  useEffect(() => {
    if (!isAccountMenuOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
        accountButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isAccountMenuOpen])

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    saveThemePreference(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    setTheme(nextTheme)
    window.dispatchEvent(new CustomEvent('officepilot-header-theme-change', { detail: nextTheme }))
  }

  const handleSignOut = () => {
    endTemporarySession()
    setIsAccountMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-header">
      <div className="header-leading">
        <button
          className="header-icon-button mobile-menu-button"
          type="button"
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          onClick={onMenuClick}
        >
          <HeaderIcon name={isSidebarOpen ? 'close' : 'menu'} />
        </button>
        <div className="header-page-title" aria-live="polite">
          <span className="header-breadcrumb">OfficePilot / Workspace</span>
          <h1>{getPageTitle(pathname)}</h1>
        </div>
      </div>

      <div className="header-actions">
        <label className={`header-search${isSearchOpen ? ' is-open' : ''}`}>
          <HeaderIcon name="search" />
          <input
            autoFocus={isSearchOpen}
            type="search"
            aria-label="Search OfficePilot"
            placeholder="Search"
          />
        </label>
        <button
          className="header-icon-button mobile-search-button"
          type="button"
          aria-label={isSearchOpen ? 'Close search' : 'Open search'}
          aria-expanded={isSearchOpen}
          onClick={() => setIsSearchOpen((open) => !open)}
        >
          <HeaderIcon name={isSearchOpen ? 'close' : 'search'} />
        </button>
        <button className="header-icon-button header-notifications" type="button" aria-label="Notifications, unread">
          <HeaderIcon name="bell" />
          <span className="notification-indicator" aria-hidden="true" />
        </button>
        <button
          className="header-icon-button"
          type="button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={handleThemeToggle}
        >
          <HeaderIcon name={theme === 'light' ? 'moon' : 'sun'} />
        </button>
        <div className="header-account" ref={accountMenuRef}>
          <button
            ref={accountButtonRef}
            className="header-profile"
            type="button"
            aria-label={`Account: ${user.name}, ${user.role}`}
            aria-haspopup="menu"
            aria-expanded={isAccountMenuOpen}
            aria-controls="header-account-menu"
            onClick={() => setIsAccountMenuOpen((open) => !open)}
          >
            <span className="header-avatar" aria-hidden="true">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : getInitials(user.name)}
            </span>
            <span className="header-user-name">{user.name}</span>
          </button>
          {isAccountMenuOpen && (
            <div className="header-account-menu" id="header-account-menu" role="menu" aria-label="Account options">
              <Link role="menuitem" to="/settings?section=profile" onClick={() => setIsAccountMenuOpen(false)}>
                Profile
              </Link>
              <Link role="menuitem" to="/settings" onClick={() => setIsAccountMenuOpen(false)}>
                Settings
              </Link>
              <span className="header-account-divider" role="separator" />
              <button role="menuitem" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}