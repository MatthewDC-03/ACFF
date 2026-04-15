import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import VideoPlayer from "../../components/VideoCompo"
import Video from "../../assets/videos/cattt.mp4"
import ClickableImage from "../../components/Buttons/ClickableImage"
import CommentIcon from "../../assets/svg/comment.svg"
import HeartIcon from "../../assets/svg/heart.svg"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import DirectSidebar from "../../components/ClickableElement/DirectSidebar"
import Profile from "../../assets/svg/profile.svg"
import Homes from "../../assets/svg/home.svg"

const Home = () =>{
    const [comment,setComment] = useState(false)
    const [heart,setHeart] = useState(false)
    const navigate = useNavigate()

    // Ensure body snap scroll is restored when coming from profile page
    useEffect(() => {
        document.body.style.overflow = ''
        document.body.style.height = '100vh'
    }, [])

    function handleCommentClick(){
        setComment(item => !item)
    }
    function handleHeartClick(){
        setHeart(item => !item)
    }
    
    function handleProfileClick(){
        navigate('/profile')
    }

    return(
        <>
        {/* Navbar */}
        <Navbar>
        <Link to="/wifi" >
                <PrimaryButton 
                text="Let's Feed" 
                className='rounded-lg'
                />
                </Link>
        </Navbar>
        {/* Homepage Container */}
        <div className="absolute flex flex-row h-[calc(100vh-89.09px)] mt-[89.09px] w-100">
            <Sidebar>
                {/* Options */}
            <div className="flex flex-col gap-10" >
            <DirectSidebar
            image={Homes}
            size={28}
            text="For You"
            color="text-primary"
            filter="brightness(0) saturate(100%) invert(73%) sepia(7%) saturate(1468%) hue-rotate(72deg) brightness(88%) contrast(86%)"
            font_size="text-xl"
            />
            <DirectSidebar
            image={Profile}
            size={28}
            text="Profile"
            color="text-black"
            filter="brightness(0) saturate(100%) invert(0%) sepia(86%) saturate(19%) hue-rotate(252deg) brightness(94%) contrast(76%)"
            font_size="text-xl"
            onClick={handleProfileClick}
            />
            </div>
            </Sidebar>
            {/* Videos Container */}
            <div className="h-100 w-[calc(100vw-300px)] p-7 overflow-auto flex items-center flex-col gap-14 snap-y snap-mandatory" >
                    {/* Wrapper of the video */}
            <div className=" flex flex-row items-end justify-center gap-5 h-100 w-100 snap-center">
            <VideoPlayer url={Video} />
            {/* User Actions */}
            <div className="flex flex-col gap-3">
                {/* Heart Action */}
                <ClickableImage
                action={handleHeartClick}
                getAction={heart}
                src={HeartIcon}
                />
                {/* Comment Action */}
                <ClickableImage
                action={handleCommentClick}
                getAction={comment}
                src={CommentIcon}
                />
            </div>
            </div>
            </div>
        </div>
        </>
    )
}

export default Home