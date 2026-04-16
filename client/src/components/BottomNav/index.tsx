import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import HomeIcon from '../../assets/svg/home.svg'
import ProfileIcon from '../../assets/svg/profile.svg'
import LogoutIcon from '../../assets/svg/logout.svg'

// CSS filter that turns a black SVG into the app's primary green (#80AF81)
const ACTIVE_FILTER = 'brightness(0) saturate(100%) invert(73%) sepia(7%) saturate(1468%) hue-rotate(72deg) brightness(88%) contrast(86%)'
// Neutral dark filter for inactive icons
const INACTIVE_FILTER = 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(100%)'

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/profile', icon: ProfileIcon, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex md:hidden items-center justify-around z-10">
      {navItems.map(({ path, icon, label }) => (
        <Link
          key={path}
          to={path}
          className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5"
          aria-label={label}
        >
          <img
            src={icon}
            alt={label}
            className="w-5 h-5 object-contain transition-all duration-200"
            style={{ filter: isActive(path) ? ACTIVE_FILTER : INACTIVE_FILTER }}
          />
          <span
            className="text-[9px] font-semibold transition-colors duration-200"
            style={{ color: isActive(path) ? '#80AF81' : '#666' }}
          >
            {label}
          </span>
        </Link>
      ))}

      {user ? (
        <button
          className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5"
          aria-label="Logout"
          onClick={async () => {
            const result = await logout()
            if (result) navigate('/login')
          }}
        >
          <img
            src={LogoutIcon}
            alt="Logout"
            className="w-5 h-5 object-contain transition-all duration-200"
            style={{ filter: INACTIVE_FILTER }}
          />
          <span className="text-[9px] font-semibold text-[#666]">Logout</span>
        </button>
      ) : (
        <Link
          to="/login"
          className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5"
          aria-label="Login"
        >
          <img
            src={LogoutIcon}
            alt="Login"
            className="w-5 h-5 object-contain transition-all duration-200"
            style={{ filter: INACTIVE_FILTER }}
          />
          <span className="text-[9px] font-semibold text-[#666]">Login</span>
        </Link>
      )}
    </nav>
  )
}

export default BottomNav
