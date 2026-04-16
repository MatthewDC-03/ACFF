import { Link } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import SecondaryButton from "../../components/Buttons/Secondary"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useState } from "react"
import ClockComponent from '../../components/Container/ClockComponent'
import AppLayout from "../../components/AppLayout"

export const TimeFeed = () => {
    const { user } = useAuthContext()
    const userId = user?.userIdLogin
    const [isLoadng, setIsLoading] = useState<boolean>(false)

    const handleToggleType = async () => {
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
                setTimeout(() => {
                    setIsLoading(false)
                }, 5000)
            } else {
                console.log(data);
            }
        } catch (error) {
            console.error('Error toggling type:', error);
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
                    <Link to='/feed'>
                        <SecondaryButton
                            text="Feed Now"
                            className={`${isLoadng && 'bg-primary/50 cursor-not-allowed'} text-white w-full border-0 bg-primary`}
                            onClick={() => {}}
                            disabled={isLoadng}
                        />
                    </Link>
                    <Link to="/clock">
                        <SecondaryButton
                            text="Timed Feed"
                            className="text-white w-full border-0 bg-primary"
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
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 pb-16 md:pb-0 w-full">
                <div className="w-full flex justify-center">
                    <ClockComponent />
                </div>
            </div>
        </AppLayout>
    )
}

export default TimeFeed
