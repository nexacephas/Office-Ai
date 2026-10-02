import { useContext, type ReactNode, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext, type AuthUser } from '../../../context/AuthContext'
import { endTemporarySession } from '../../../services/authService'
import './Sidebar.css'

type IconName =
  | 'layout-dashboard'
  | 'check-square'
  | 'file-text'
  | 'mail'
  | 'calendar-days'
  | 'sparkles'
  | 'pen-line'
  | 'arrow-left-right'
  | 'file-search'
  | 'folder-kanban'
  | 'clipboard-check'
  | 'book-open'
  | 'bell'
  | 'settings'
  | 'chevron'
  | 'panel-left-close'
  | 'panel-left-open'

interface NavigationItem {
  label: string
  to: string
  icon: IconName
  badge?: number
}

interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

interface SidebarProps {
  isOpen: boolean
  isInactive: boolean
  isCollapsed: boolean
  onNavigate: () => void
  onToggleCollapse: () => void
}

const defaultUser: AuthUser = {
  name: 'Cephas',
  role: 'Administrator',
}

const navigationSections: NavigationGroup[] = [
  {
    title: 'HOME',
    items: [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: 'layout-dashboard',
      },
    ],
  },
  {
    title: 'MY WORK',
    items: [
      {
        label: 'Tasks',
        to: '/tasks',
        icon: 'check-square',
      },
      {
        label: 'Documents',
        to: '/documents',
        icon: 'file-text',
      },
      {
        label: 'Correspondence',
        to: '/correspondence',
        icon: 'mail',
      },
      {
        label: 'Meetings',
        to: '/meetings',
        icon: 'calendar-days',
      },
    ],
  },
  {
    title: 'OFFICE AI',
    items: [
      {
        label: 'AI Assistant',
        to: '/ai',
        icon: 'sparkles',
      },
      {
        label: 'Write',
        to: '/ai/write',
        icon: 'pen-line',
      },
      {
        label: 'Summarize',
        to: '/ai/summarize',
        icon: 'file-search',
      },
      {
        label: 'Convert',
        to: '/ai/convert',
        icon: 'arrow-left-right',
      },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      {
        label: 'Files & Registry',
        to: '/registry',
        icon: 'folder-kanban',
      },
      {
        label: 'Approvals',
        to: '/approvals',
        icon: 'clipboard-check',
      },
      {
        label: 'Knowledge',
        to: '/knowledge',
        icon: 'book-open',
      },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      {
        label: 'Notifications',
        to: '/notifications',
        icon: 'bell',
        badge: 3,
      },
      {
        label: 'Settings',
        to: '/settings',
        icon: 'settings',
      },
    ],
  },
]

function SidebarIcon({ name }: { name: IconName }) {
  let iconContent: ReactNode

  switch (name) {
    case 'layout-dashboard':
      iconContent = (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="4.5" rx="1.5" />
          <rect x="14" y="10.5" width="7" height="10.5" rx="1.5" />
          <rect x="3" y="13" width="7" height="8" rx="1.5" />
        </>
      )
      break

    case 'check-square':
      iconContent = (
        <>
          <path d="M9 11.25 11 13.25l4.5-5" />
          <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
        </>
      )
      break

    case 'file-text':
      iconContent = (
        <>
          <path d="M14 3.5H7.5A2.5 2.5 0 0 0 5 6v12a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18V8.5Z" />
          <path d="M14 3.5V8.5H19M8.5 12.25h6.75M8.5 15.75h6.75" />
        </>
      )
      break

    case 'mail':
      iconContent = (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
          <path d="m4.75 7 7.25 5.5 7.25-5.5" />
        </>
      )
      break

    case 'calendar-days':
      iconContent = (
        <>
          <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
          <path d="M8 3.5v4M16 3.5v4M3.5 10.5h17M8 14.5h2.5M13.5 14.5H16M8 18.5h2.5M13.5 18.5H16" />
        </>
      )
      break

    case 'sparkles':
      iconContent = (
        <>
          <path d="m12 2.75 1.7 5.15 5.15 1.7-5.15 1.7L12 16.25l-1.7-5.15L5.15 9.4l5.15-1.7L12 2.75Z" />
          <path d="m19.5 14.25 1.1 3.2 3.15 1.1-3.15 1.1-1.1 3.15-1.1-3.15-3.15-1.1 3.15-1.1 1.1-3.2Z" />
        </>
      )
      break

    case 'pen-line':
      iconContent = (
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </>
      )
      break

    case 'arrow-left-right':
      iconContent = (
        <>
          <path d="M7 8h12M7 8l3-3M7 8l3 3" />
          <path d="M17 16H5M17 16l-3 3M17 16l-3-3" />
        </>
      )
      break

    case 'file-search':
      iconContent = (
        <>
          <path d="M14 3.5H7.5A2.5 2.5 0 0 0 5 6v12a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18V8.5Z" />
          <path d="M14 3.5V8.5H19" />
          <circle cx="10.5" cy="15.75" r="2.75" />
          <path d="m12.5 17.75 2.5 2.5" />
        </>
      )
      break

    case 'folder-kanban':
      iconContent = (
        <>
          <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3l2 2h7a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-10Z" />
          <path d="M8 12h2.5v5H8zM13 9h2.5v8H13z" />
        </>
      )
      break

    case 'clipboard-check':
      iconContent = (
        <>
          <path d="M9 4.5h6" />
          <path d="M9 4.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
          <path d="M7.5 7.5h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
          <path d="m8.75 13.5 1.7 1.7 4.25-4.5" />
        </>
      )
      break

    case 'book-open':
      iconContent = (
        <>
          <path d="M4.5 6.5A2.5 2.5 0 0 1 7 4h10.5A2.5 2.5 0 0 1 20 6.5v11.5H7a2.5 2.5 0 0 0-2.5 2.5V6.5Z" />
          <path d="M4.5 18.5A2.5 2.5 0 0 1 7 16h13M8 7.5h8M8 11.25h8" />
        </>
      )
      break

    case 'bell':
      iconContent = (
        <>
          <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </>
      )
      break

    case 'settings':
      iconContent = (
        <>
          <circle cx="12" cy="12" r="3.25" />
          <path d="M12 2.75v2.5M12 18.75v2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2.75 12h2.5M18.75 12h2.5M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
        </>
      )
      break

    case 'chevron':
      iconContent = <path d="m8.5 10 3.5 3.5 3.5-3.5" />
      break

    case 'panel-left-close':
      iconContent = (
        <>
          <rect x="4" y="5.5" width="16" height="13" rx="1.5" />
          <path d="M15 7.5 10.5 12l4.5 4.5" />
        </>
      )
      break

    case 'panel-left-open':
      iconContent = (
        <>
          <rect x="4" y="5.5" width="16" height="13" rx="1.5" />
          <path d="m9 7.5 4.5 4.5L9 16.5" />
        </>
      )
      break
  }

  return (
    <svg
      aria-hidden="true"
      className="sidebar-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      >
        {iconContent}
      </g>
    </svg>
  )
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Sidebar({
  isOpen,
  isInactive,
  isCollapsed,
  onNavigate,
  onToggleCollapse,
}: SidebarProps) {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const user = auth?.user ?? defaultUser

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileMenuOpen])

  const handleSignOut = () => {
    endTemporarySession()
    setIsProfileMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <aside
      id="app-sidebar"
      className={`app-sidebar${isOpen ? ' is-open' : ''}${
        isCollapsed ? ' is-collapsed' : ''
      }`}
      aria-label="Primary navigation"
      aria-hidden={isInactive || undefined}
      inert={isInactive}
    >
      <div className="sidebar-brand-row">
        <Link
          to="/dashboard"
          className="sidebar-brand"
          aria-label="OfficePilot AI dashboard"
          onClick={onNavigate}
        >
          <div className="sidebar-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M8 25V11.5L16 7l8 4.5V25" />
              <path d="M12 25v-7h8v7M5 25h22M16 7V4" />
              <path d="m25 5 .8 2.2L28 8l-2.2.8L25 11l-.8-2.2L22 8l2.2-.8L25 5Z" />
            </svg>
          </div>

          {!isCollapsed && (
            <div className="sidebar-brand-copy">
              <span className="sidebar-brand-name">OfficePilot AI</span>
              <span className="sidebar-brand-description">
                Your workplace assistant
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          className="sidebar-collapse-toggle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapse}
        >
          <SidebarIcon
            name={
              isCollapsed ? 'panel-left-open' : 'panel-left-close'
            }
          />
        </button>
      </div>

      <nav
        className="sidebar-navigation"
        aria-label="Office navigation"
      >
        {navigationSections.map((section) => (
          <section
            className="sidebar-group"
            key={section.title}
            aria-label={section.title}
          >
            {!isCollapsed && (
              <h2 className="sidebar-group-label">
                {section.title}
              </h2>
            )}

            <ul className="sidebar-link-list">
              {section.items.map((item) => (
                <li key={`${section.title}-${item.label}`}>
                  <NavLink
                    to={item.to}
                    end={
                      item.to === '/dashboard' ||
                      item.to === '/ai' ||
                      item.to.startsWith('/ai/')
                    }
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      isActive
                        ? 'sidebar-link is-active'
                        : 'sidebar-link'
                    }
                    title={isCollapsed ? item.label : undefined}
                    aria-label={item.label}
                  >
                    <span className="sidebar-link-icon">
                      <SidebarIcon name={item.icon} />
                    </span>

                    {!isCollapsed && (
                      <span className="sidebar-link-label">
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.badge ? (
                      <span className="sidebar-link-badge">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="sidebar-profile" ref={profileMenuRef}>
        <button
          type="button"
          className="sidebar-profile-button"
          aria-label="Open user menu"
          aria-expanded={isProfileMenuOpen}
          onClick={() =>
            setIsProfileMenuOpen((open) => !open)
          }
        >
          <div className="sidebar-avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>

          {!isCollapsed && (
            <div className="sidebar-profile-copy">
              <span className="sidebar-profile-name">
                {user.name}
              </span>
              <span className="sidebar-profile-role">
                {user.role}
              </span>
            </div>
          )}

          {!isCollapsed && (
            <span
              className="sidebar-profile-menu-indicator"
              aria-hidden="true"
            >
              <SidebarIcon name="chevron" />
            </span>
          )}
        </button>

        {isProfileMenuOpen && (
          <div
            className="sidebar-profile-dropdown"
            role="menu"
            aria-label="User actions"
          >
            <Link
              to="/settings?section=profile"
              role="menuitem"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Profile
            </Link>

            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Settings
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}