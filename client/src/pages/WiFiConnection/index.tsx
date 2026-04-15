import Navbar from "../../components/Navbar"
import { Link } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import Sidebar from "../../components/Sidebar"
import { useAuthContext } from "../../hooks/useAuthContext"
import DirectSidebar from "../../components/ClickableElement/DirectSidebar"
import Profile from "../../assets/svg/profile.svg"
import WiFiCat from "../../assets/svg/wifi_cat.svg"
import UnderConstruction from "../../assets/svg/under_construction.svg"
import { useState } from "react"
export const WiFiConnection = () =>{
    const { user } = useAuthContext() 
    const userId = user?.userIdLogin
    const [ isLoadng, setIsLoading ] = useState<boolean>(false)
     

    const handleToggleType = async () =>{
        try {
            const res = await fetch('https://acff-api.vercel.app/api/user/toggle-type', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: userId }), // Send username instead of userId
            });

            const data = await res.json(); // Use 'res' to get the response JSON
            if (res.ok) {
                console.log(data); // Log the success message
                setIsLoading(true)
                setTimeout(()=>{
                    setIsLoading(false)
                }, 5000)
            } else {
                console.log(data); // Log the error message
            }
        } catch (error) {
            console.error('Error toggling type:', error); // Log any errors that occur
        }
    }

    return(
        <>
        <Navbar>
        <Link to="/" >
                <PrimaryButton 
                text="Go Back" 
                className='rounded-lg'
                />
                </Link>
        </Navbar>
        <div className="absolute flex w-full justify-between flex-row h-[calc(100vh-89.09px)] mt-[89.09px] w-100">
        <Sidebar>
                {/* Options */}
            <div className="flex flex-col gap-10" >
            <DirectSidebar
            image={Profile}
            size={28}
            text="Profile"
            color="text-black"
            filter="brightness(0) saturate(100%) invert(0%) sepia(86%) saturate(19%) hue-rotate(252deg) brightness(94%) contrast(76%)"
            font_size="text-xl"
            />
            </div>
            </Sidebar>
        {userId === "69dfb15bced1f6ebaa049838" ? (
                <div className="w-full h-full flex flex-col justify-center items-center pr-64" >
                    <img src={WiFiCat} alt="cat" height={400} width={400}/>
                <div className="h-fit w-fit flex flex-col gap-5" >
                    <h1 className="text-4xl font-extrabold" >Connect to FeederShareWiFiManager</h1>
                    <p className="text-lg font-semibold leading-10 " >To access the FeederShare system, follow these steps: <br />
                        1. Go to Settings on your device and click WiFi. <br />
                        2. Find and connect to FeederShareWiFiManager. <br />
                        3. Once connected, wait for the browser to automatically pop up for further access to the system and monitoring features. <br />
                     </p>
                </div>
                <div className="w-full flex justify-end" >
                <Link to="/feed" >
                <PrimaryButton 
                text="Done" 
                className='rounded-lg'
                />
                </Link>
                </div>
            </div>
            )
            :
            (
                <div className="w-full h-full flex flex-col justify-center items-center pr-40" >
                <div className="h-fit w-3/4 flex flex-col gap-5" >
                    <img src={UnderConstruction} alt="under_construction" height={700} width={700} />
                    <h1 className="text-4xl font-extrabold" >Testing Mode - Authorized Access Only</h1>
                    <p className="text-lg font-semibold leading-10 " >
This site is currently in the testing phase and is only accessible to authorized users. Unauthorized access is restricted. Please ensure you have the proper credentials to continue.
                     </p>
                </div>
            </div>
            )
        }
        
        </div>
        </>
    )
}

export default WiFiConnection
