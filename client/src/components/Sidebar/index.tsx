
import { useAuthContext } from "../../hooks/useAuthContext"
import SecondaryButton from "../../components/Buttons/Secondary"
import { useLogout } from "../../hooks/useLogout"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import LogoutIcon from "../../assets/svg/logout.svg"

const Sidebar = ({children} : {
    children: React.ReactNode
}) =>{
    
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const navigate = useNavigate()
    return(
        <div className="hidden md:flex md:w-[72px] lg:w-[300px] flex-shrink-0 sticky top-0 h-[calc(100vh-89.09px)] md:p-4 lg:p-10 flex-col items-center justify-between overflow-hidden">
            {children}
            
            {/* Gateway Button */}
            {!user && 
            <Link to="/login" title="Log In">
                {/* Icon-only on tablet */}
                <span className="flex lg:hidden items-center justify-center min-w-[44px] min-h-[44px]">
                    <img src={LogoutIcon} alt="Log In" width={24} height={24} />
                </span>
                {/* Full button on desktop */}
                <span className="hidden lg:block">
                    <SecondaryButton
                        disabled={false}
                        text="Log In"
                        className=""
                        onClick={()=>{}}
                    />
                </span>
            </Link>}
            {user &&
                <div title="Log out">
                    {/* Icon-only on tablet */}
                    <button
                        className="flex lg:hidden items-center justify-center min-w-[44px] min-h-[44px] hover:opacity-80 transition-opacity"
                        onClick={async () => {
                            const result = await logout()
                            if (result) navigate('/login')
                        }}
                    >
                        <img src={LogoutIcon} alt="Log out" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(400%) hue-rotate(320deg) brightness(90%) contrast(90%)' }} />
                    </button>
                    {/* Full button on desktop */}
                    <span className="hidden lg:block">
                        <SecondaryButton
                            disabled={false}
                            text="Log out"
                            className="border-red-400 text-red-400"
                            onClick={async () => {
                                const result = await logout()
                                if (result) navigate('/login')
                            }}
                        />
                    </span>
                </div>
            }
        </div>
    )
}

export default Sidebar