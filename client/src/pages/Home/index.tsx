import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import VideoPlayer from "../../components/VideoCompo"
import LocalVideo from "../../assets/videos/cattt.mp4"
import CatVideo2 from "../../assets/videos/mixkit-pet-owner-playing-with-a-cute-cat-1779-hd-ready.mp4"
import CatVideo3 from "../../assets/videos/mixkit-petting-a-cute-cat-close-up-1778-hd-ready.mp4"
import ClickableImage from "../../components/Buttons/ClickableImage"
import CommentIcon from "../../assets/svg/comment.svg"
import HeartIcon from "../../assets/svg/heart.svg"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/Primary"
import DirectSidebar from "../../components/ClickableElement/DirectSidebar"
import Profile from "../../assets/svg/profile.svg"
import Homes from "../../assets/svg/home.svg"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useApi } from "../../hooks/useApi"

// Cat video feed — local videos only (online sources block direct embedding)
const VIDEO_FEED = [
    {
        id: "cattt_main",
        url: LocalVideo,
        title: "Cat on Piano"
    },
    {
        id: "cat_playing_1779",
        url: CatVideo2,
        title: "Pet Owner Playing with Cat"
    },
    {
        id: "cat_petting_1778",
        url: CatVideo3,
        title: "Petting a Cute Cat"
    },
]

interface CommentType {
    _id: string
    userId: string
    username: string
    text: string
    createdAt: string
}

interface VideoState {
    liked: boolean
    likeCount: number
    comments: CommentType[]
}

const Home = () => {
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { apiCall } = useApi()
    const inputRef = useRef<HTMLInputElement>(null)

    // Per-video state map
    const [videoStates, setVideoStates] = useState<Record<string, VideoState>>(
        Object.fromEntries(VIDEO_FEED.map(v => [v.id, { liked: false, likeCount: 0, comments: [] }]))
    )
    const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({})

    // Comment drawer state
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
    const [commentText, setCommentText] = useState('')
    const [posting, setPosting] = useState(false)

    // Restore body snap scroll
    useEffect(() => {
        document.body.style.overflow = ''
        document.body.style.height = '100vh'
    }, [])

    // Fetch likes for all videos on mount
    useEffect(() => {
        if (!user) return
        VIDEO_FEED.forEach(async (video) => {
            try {
                const res = await apiCall(`/api/user/likes/${video.id}?userId=${user.userIdLogin}`)
                if (res.ok) {
                    const data = await res.json()
                    setVideoStates(prev => ({
                        ...prev,
                        [video.id]: { ...prev[video.id], liked: data.liked, likeCount: data.count }
                    }))
                }
            } catch { /* silent */ }
        })
    }, [user])

    // Fetch comments when drawer opens
    useEffect(() => {
        if (!activeVideoId) return
        const fetchComments = async () => {
            try {
                const res = await apiCall(`/api/user/comments/${activeVideoId}`)
                if (res.ok) {
                    const data = await res.json()
                    setVideoStates(prev => ({
                        ...prev,
                        [activeVideoId]: { ...prev[activeVideoId], comments: data }
                    }))
                }
            } catch { /* silent */ }
        }
        fetchComments()
        setTimeout(() => inputRef.current?.focus(), 300)
    }, [activeVideoId])

    const handleToggleLike = async (videoId: string) => {
        if (!user || likeLoading[videoId]) return
        setLikeLoading(prev => ({ ...prev, [videoId]: true }))
        const wasLiked = videoStates[videoId].liked
        // Optimistic update
        setVideoStates(prev => ({
            ...prev,
            [videoId]: {
                ...prev[videoId],
                liked: !wasLiked,
                likeCount: wasLiked ? prev[videoId].likeCount - 1 : prev[videoId].likeCount + 1
            }
        }))
        try {
            const res = await apiCall('/api/user/likes/toggle', {
                method: 'POST',
                body: JSON.stringify({ videoId, userId: user.userIdLogin })
            })
            if (res.ok) {
                const data = await res.json()
                setVideoStates(prev => ({
                    ...prev,
                    [videoId]: { ...prev[videoId], liked: data.liked, likeCount: data.count }
                }))
            } else {
                // Revert
                setVideoStates(prev => ({
                    ...prev,
                    [videoId]: { ...prev[videoId], liked: wasLiked, likeCount: wasLiked ? prev[videoId].likeCount + 1 : prev[videoId].likeCount - 1 }
                }))
            }
        } catch {
            setVideoStates(prev => ({
                ...prev,
                [videoId]: { ...prev[videoId], liked: wasLiked }
            }))
        }
        setLikeLoading(prev => ({ ...prev, [videoId]: false }))
    }

    const handlePostComment = async () => {
        if (!commentText.trim() || !user || !activeVideoId) return
        setPosting(true)
        try {
            const res = await apiCall('/api/user/comments', {
                method: 'POST',
                body: JSON.stringify({
                    videoId: activeVideoId,
                    userId: user.userIdLogin,
                    username: user.username,
                    text: commentText.trim()
                })
            })
            if (res.ok) {
                const newComment = await res.json()
                setVideoStates(prev => ({
                    ...prev,
                    [activeVideoId]: {
                        ...prev[activeVideoId],
                        comments: [newComment, ...prev[activeVideoId].comments]
                    }
                }))
                setCommentText('')
            }
        } catch { /* silent */ }
        setPosting(false)
    }

    const handleDeleteComment = async (videoId: string, commentId: string) => {
        try {
            const res = await apiCall(`/api/user/comments/${commentId}`, {
                method: 'DELETE',
                body: JSON.stringify({ userId: user?.userIdLogin })
            })
            if (res.ok) {
                setVideoStates(prev => ({
                    ...prev,
                    [videoId]: {
                        ...prev[videoId],
                        comments: prev[videoId].comments.filter(c => c._id !== commentId)
                    }
                }))
            }
        } catch { /* silent */ }
    }

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h ago`
        return `${Math.floor(hrs / 24)}d ago`
    }

    const activeComments = activeVideoId ? videoStates[activeVideoId]?.comments ?? [] : []

    return (
        <>
            <Navbar>
                <Link to="/wifi">
                    <PrimaryButton text="Let's Feed" className='rounded-lg' />
                </Link>
            </Navbar>

            <div className="absolute flex flex-row h-[calc(100vh-89.09px)] mt-[89.09px] w-100">
                <Sidebar>
                    <div className="flex flex-col gap-10">
                        <DirectSidebar
                            image={Homes} size={28} text="For You" color="text-primary"
                            filter="brightness(0) saturate(100%) invert(73%) sepia(7%) saturate(1468%) hue-rotate(72deg) brightness(88%) contrast(86%)"
                            font_size="text-xl"
                        />
                        <DirectSidebar
                            image={Profile} size={28} text="Profile" color="text-black"
                            filter="brightness(0) saturate(100%) invert(0%) sepia(86%) saturate(19%) hue-rotate(252deg) brightness(94%) contrast(76%)"
                            font_size="text-xl"
                            onClick={() => navigate('/profile')}
                        />
                    </div>
                </Sidebar>

                {/* Videos Container — snap scroll */}
                <div className="h-100 w-[calc(100vw-300px)] p-7 overflow-y-scroll flex items-center flex-col gap-14 snap-y snap-mandatory">
                    {VIDEO_FEED.map((video) => {
                        const state = videoStates[video.id]
                        return (
                            <div key={video.id} className="flex flex-row items-end justify-center gap-5 h-100 w-100 snap-center flex-shrink-0">
                                <VideoPlayer url={video.url} />

                                {/* User Actions */}
                                <div className="flex flex-col gap-3">
                                    {/* Heart */}
                                    <div className="flex flex-col items-center gap-1">
                                        <ClickableImage
                                            action={() => handleToggleLike(video.id)}
                                            getAction={state.liked}
                                            src={HeartIcon}
                                        />
                                        <span className={`text-sm font-semibold ${state.liked ? 'text-primary' : 'text-black/50'}`}>
                                            {state.likeCount}
                                        </span>
                                    </div>
                                    {/* Comment */}
                                    <div className="flex flex-col items-center gap-1">
                                        <ClickableImage
                                            action={() => setActiveVideoId(video.id)}
                                            getAction={activeVideoId === video.id}
                                            src={CommentIcon}
                                        />
                                        <span className={`text-sm font-semibold ${activeVideoId === video.id ? 'text-primary' : 'text-black/50'}`}>
                                            {state.comments.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Comment Drawer ── */}
            {activeVideoId && (
                <div className="fixed inset-0 z-50 flex items-end justify-end" onClick={() => setActiveVideoId(null)}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div
                        className="relative z-10 bg-white rounded-tl-2xl rounded-bl-2xl flex flex-col shadow-2xl"
                        style={{ width: '420px', height: 'calc(100vh - 89.09px)', marginTop: '89.09px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
                            <div>
                                <h2 className="text-lg font-bold text-black">Comments</h2>
                                <p className="text-xs text-black/40">{activeComments.length} comment{activeComments.length !== 1 ? 's' : ''}</p>
                            </div>
                            <button
                                onClick={() => setActiveVideoId(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition text-black/50 hover:text-black text-xl font-light"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                            {activeComments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-black/30">
                                    <img src={CommentIcon} alt="no comments" className="w-12 h-12 opacity-20" />
                                    <p className="text-sm">No comments yet. Be the first!</p>
                                </div>
                            ) : (
                                activeComments.map(c => (
                                    <div key={c._id} className="flex gap-3 group">
                                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-primary">{c.username.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-semibold text-black">{c.username}</span>
                                                <span className="text-xs text-black/30">{formatTime(c.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-black/70 mt-0.5 break-words">{c.text}</p>
                                        </div>
                                        {user?.userIdLogin === c.userId && (
                                            <button
                                                onClick={() => handleDeleteComment(activeVideoId, c._id)}
                                                className="opacity-0 group-hover:opacity-100 transition text-black/30 hover:text-red-400 text-xs flex-shrink-0 self-start mt-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input */}
                        <div className="px-5 py-4 border-t border-primary/20 bg-white">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-primary">{user.username?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-primary/10 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition placeholder:text-black/30"
                                    />
                                    <button
                                        onClick={handlePostComment}
                                        disabled={!commentText.trim() || posting}
                                        className={`w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition hover:brightness-95 ${!commentText.trim() || posting ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-center text-sm text-black/40">
                                    <Link to="/login" className="text-primary font-semibold">Log in</Link> to comment
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Home
