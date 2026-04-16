import { Link } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import SecondaryButton from "../../components/Buttons/Secondary"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useApi } from "../../hooks/useApi"
import { useState } from "react"
import AppLayout from "../../components/AppLayout"

export const Hardware = () => {
    const { user } = useAuthContext()
    const { apiCall } = useApi()
    const userId = user?.userIdLogin
    const [isLoadng, setIsLoading] = useState<boolean>(false)

    const handleToggleType = async () => {
        try {
            const res = await apiCall('https://acff-api.vercel.app/api/user/toggle-type', {
                method: 'PATCH',
                body: JSON.stringify({ _id: userId }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log(data);
                setIsLoading(true)
                setTimeout(() => {
                    setIsLoading(false)
                }, 5000)
            } else {
                console.log(data);
                alert('Error: ' + data.error)
            }
        } catch (error) {
            console.error('Error toggling type:', error);
            alert('Error: ' + error)
        }
    }

    return (
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
                    <SecondaryButton
                        text="Feed Now"
                        className={`${isLoadng && 'bg-primary/50 cursor-not-allowed'} text-white border-0 bg-primary`}
                        onClick={handleToggleType}
                        disabled={isLoadng}
                    />
                    <Link to="/clock">
                        <SecondaryButton
                            text="Timed Feed"
                            className="text-white border-0 w-full bg-primary"
                            onClick={() => {}}
                            disabled={false}
                        />
                    </Link>
                    <Link to='/logs'>
                        <SecondaryButton
                            text="Feed Logs"
                            className="w-full"
                            onClick={() => {}}
                            disabled={false}
                        />
                    </Link>
                    <hr className="border-black/20" />
                    <p className="text-sm text-black/40">Captured something on camera? Click "View Records" to watch the footage instantly!</p>
                    <SecondaryButton
                        text="View Records"
                        className=""
                        onClick={() => {}}
                        disabled={false}
                    />
                </div>
            }
        >
            <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-7 pb-16 md:pb-0">
                <img
                    src="https://61ac-180-191-32-69.ngrok-free.app/mjpeg/1"
                    alt="ESP32-CAM Stream"
                    className="w-full max-h-[60vh] md:max-h-[500px] object-contain border border-black rounded-lg"
                />
            </div>
        </AppLayout>
    )
}

export default Hardware
