import { Link } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import SecondaryButton from "../../components/Buttons/Secondary"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useEffect, useState } from "react"
import AppLayout from "../../components/AppLayout"

type Log = {
    _id: string;
    status: string;
    timestamp: string;
    userId: string;
    __v: number;
  };

export const FeedLogs = () =>{
    const { user } = useAuthContext() 
    const userId = user?.userIdLogin
    const [ isLoadng, setIsLoading ] = useState<boolean>(false)
    const [getLogs, setGetLogs] = useState<Log[]>([])
     
    useEffect(()=>{
        const fetchLogs = async () => {
            try{
                const response = await fetch(`https://acff-api.vercel.app/api/user/${userId}/get-logs`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
    
                const result = await response.json();
                setGetLogs(result)

    
            }
            catch(error: any){
                console.error(error)
            }
        }
        if(userId){
            fetchLogs()
        }
    }, [])

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

    const navbarChildren = (
        <Link to="/">
            <PrimaryButton
                text="Go Back"
                className='rounded-lg'
            />
        </Link>
    )

    const sidebarChildren = (
        <div className="flex flex-col gap-10">
            <Link to="/feed">
                <SecondaryButton
                    text="Feed Now"
                    className={`${isLoadng && 'bg-primary/50 cursor-not-allowed'} text-white w-full border-0 bg-primary`}
                    onClick={handleToggleType}
                    disabled={isLoadng}
                />
            </Link>
            <Link to="/clock">
                <SecondaryButton
                    text="Timed Feed"
                    className="text-white w-full border-0 bg-primary"
                    onClick={()=>{}}
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
    )

    return (
        <AppLayout navbarChildren={navbarChildren} sidebarChildren={sidebarChildren}>
            <div className="w-full py-4 md:py-7 flex justify-center px-4 md:px-0 pb-16 md:pb-0">
                <div className="w-full max-w-2xl flex flex-col gap-3">
                    <ul className="text-custom_white justify-center bg-primary flex font-medium flex-row gap-10 text-xl px-6 py-2 sticky top-0 z-10">
                        <li>Status</li>
                        <li>Timestamp</li>
                    </ul>
                    <div className="overflow-x-auto w-full">
                        <ul className="text-black flex flex-col gap-5 text-lg font-normal">
                            {
                                getLogs.map((item, index) => (
                                    <li key={item._id || index} className="flex text-lg w-full gap-10 border-b-2 border-b-primary">
                                        <span>{item.status}</span>
                                        <span>{item.timestamp}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default FeedLogs
