
import { useAuthContext } from "../../hooks/useAuthContext"
import SecondaryButton from "../../components/Buttons/Secondary"
import { useLogout } from "../../hooks/useLogout"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
const Sidebar = ({children} : {
    children: React.ReactNode
}) =>{
    
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const navigate = useNavigate()
    return(
        <div className="p-10 w-[300px] h-full flex flex-col items-center justify-between">
            {children}
            
            {/* Gateway Button */}
            {!user && 
            <Link to="/login" >
            <SecondaryButton
            disabled={false}
            text="Log In"
            className=""
            onClick={()=>{
            }}
            />
            </Link>}
            {
                user &&
               <SecondaryButton
               disabled={false}
               text="Log out"
               className="border-red-400 text-red-400"
               onClick={async ()=>{
                const result = await logout()
                if(result){
                    navigate('/login')
                }
               }}
               /> 
            }
        </div>
    )
}

export default Sidebar