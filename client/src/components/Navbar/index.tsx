import MainIcon from '../../assets/svg/main_icon.svg'
import PrimaryButton from '../Buttons/Primary'
import Direct from '../ClickableElement/Direct'
import { Link } from 'react-router-dom'
const Navbar = ({children}:{
    children: React.ReactNode
})=>{
    return(
        /* Header */
        <header className='py-4 px-4 md:px-10 fixed inset-0 w-full bg-white z-10 border-b-[2px] h-fit' >
            {/* Navbar */}
            <nav className='flex items-center justify-between' >
                <Direct 
                image={MainIcon} 
                size={65}
                text="FeederShare"
                color="text-primary"
                filter="brightness(0) saturate(100%) invert(73%) sepia(7%) saturate(1468%) hue-rotate(72deg) brightness(88%) contrast(86%)"
                font_size='text-xl md:text-3xl'
                />
                <div>
                    {children}
                </div>
            </nav>
        </header>
    )
}

export default Navbar