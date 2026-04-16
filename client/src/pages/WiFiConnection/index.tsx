import { Link } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import { useAuthContext } from "../../hooks/useAuthContext"
import DirectSidebar from "../../components/ClickableElement/DirectSidebar"
import Profile from "../../assets/svg/profile.svg"
import WiFiCat from "../../assets/svg/wifi_cat.svg"
import UnderConstruction from "../../assets/svg/under_construction.svg"
import { useState } from "react"
import AppLayout from "../../components/AppLayout"

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
                body: JSON.stringify({ _id: userId }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log(data);
                setIsLoading(true)
                setTimeout(()=>{
                    setIsLoading(false)
                }, 5000)
            } else {
                console.log(data);
            }
        } catch (error) {
            console.error('Error toggling type:', error);
        }
    }

    return(
        <AppLayout
            navbarChildren={
                <Link to="/">
                    <PrimaryButton
                        text="Go Back"
                        className='rounded-lg'
                    />
                </Link>
            }
            sidebarChildren={
                <div className="flex flex-col gap-10">
                    <DirectSidebar
                        image={Profile}
                        size={28}
                        text="Profile"
                        color="text-black"
                        filter="brightness(0) saturate(100%) invert(0%) sepia(86%) saturate(19%) hue-rotate(252deg) brightness(94%) contrast(76%)"
                        font_size="text-xl"
                    />
                </div>
            }
        >
            {userId === "69dfb15bced1f6ebaa049838" ? (
                <div className="w-full h-full flex flex-col justify-center items-center gap-5 p-4 md:p-10 pb-16 md:pb-0">
                    <img src={WiFiCat} alt="cat" className="max-w-[280px] mx-auto w-full" />
                    <div className="h-fit w-full flex flex-col gap-3">
                        <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold leading-tight">Connect to FeederShareWiFiManager</h1>
                        <p className="text-sm sm:text-base font-semibold leading-7">To access the FeederShare system, follow these steps: <br />
                            1. Go to Settings on your device and click WiFi. <br />
                            2. Find and connect to FeederShareWiFiManager. <br />
                            3. Once connected, wait for the browser to automatically pop up for further access to the system and monitoring features. <br />
                        </p>
                    </div>
                    <div className="w-full flex justify-end">
                        <Link to="/feed">
                            <PrimaryButton
                                text="Done"
                                className='rounded-lg'
                            />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col justify-center items-center p-4 md:p-10 pb-16 md:pb-0">
                    <div className="w-full max-w-2xl flex flex-col gap-5">
                        <img src={UnderConstruction} alt="under_construction" className="w-full max-w-[500px] mx-auto" />
                        <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold leading-tight">Testing Mode - Authorized Access Only</h1>
                        <p className="text-sm sm:text-base font-semibold leading-7">
This site is currently in the testing phase and is only accessible to authorized users. Unauthorized access is restricted. Please ensure you have the proper credentials to continue.
                        </p>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default WiFiConnection
