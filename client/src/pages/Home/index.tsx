import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import VideoPlayer from "../../components/VideoCompo"
import Video from "../../assets/videos/cattt.mp4"
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

// Fixed video ID for the single video on this page
const VIDEO_ID = "cattt_main"

interface CommentType {
    _id: string
    userId: string
    username: string
    text: string
    createdAt: string
}

const Home = () => {
    const [heart, setHeart] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [likeLoading, setLikeLoading] = useState(false)
    const [commentOpen, setCommentOpen] = useState(false)
    const [comments, setComments] = useState<CommentType[]>([])
    const [commentText, setCommentText] = useState('')
    const [posting, setPosting] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { apiCall } = useApi()
    const inputRef = useRef<HTMLInputElement>(null)

    // Restore body scroll for snap behavior
    useEffect(() => {
        document.body.style.overflow = ''
        document.body.style.height = '100vh'
    }, [])

    // Fetch like state on mount
    useEffect(() => {
        if (!user) return
        const fetchLikes = async () => {
            try {
                const res = await apiCall(`/api/user/likes/${VIDEO_ID}?userId=${user.userIdLogin}`)
                if (res.ok) {
                    const data = await res.json()
                    setHeart(data.liked)
                    setLikeCount(data.count)
                }
            } catch { /* silent */ }
        }
        fetchLikes()
    }, [user])

    // Fetch comments when drawer opens
    useEffect(() => {
        if (!commentOpen) return
        const fetchComments = async () => {
            try {
                const res = await apiCall(`/api/user/comments/${VIDEO_ID}`)
                if (res.ok) {
                    const data = await res.json()
                    setComments(data)
                }
            } catch { /* silent */ }
        }
        fetchComments()
        setTimeout(() => inputRef.current?.focus(), 300)
    }, [commentOpen])

    const handlePostComment = async () => {
        if (!commentText.trim() || !user) return
        setPosting(true)
        try {
            const res = await apiCall('/api/user/comments', {
                method: 'POST',
                body: JSON.stringify({
                    videoId: VIDEO_ID,
                    userId: user.userIdLogin,
                    username: user.username,
                    text: commentText.trim()
                })
            })
            if (res.ok) {
                const newComment = await res.json()
                setComments(prev => [newComment, ...prev])
                setCommentText('')
            }
        } catch { /* silent */ }
        setPosting(false)
    }

    const handleDeleteComment = async (commentId: string) => {
        try {
            const res = await apiCall(`/api/user/comments/${commentId}`, {
                method: 'DELETE',
                body: JSON.stringify({ userId: user?.userIdLogin })
            })
            if (res.ok) {
                setComments(prev => prev.filter(c => c._id !== commentId))
            }
        } catch { /* silent */ }
    }

    const handleToggleLike = async () => {
        if (!user || likeLoading) return
        setLikeLoading(true)
        // Optimistic update
        const wasLiked = heart
        setHeart(!wasLiked)
        setLikeCount(c => wasLiked ? c - 1 : c + 1)
        try {
            const res = await apiCall('/api/user/likes/toggle', {
                method: 'POST',
                body: JSON.stringify({ videoId: VIDEO_ID, userId: user.userIdLogin })
            })
            if (res.ok) {
                const data = await res.json()
                setHeart(data.liked)
                setLikeCount(data.count)
            } else {
                // Revert on failure
                setHeart(wasLiked)
                setLikeCount(c => wasLiked ? c + 1 : c - 1)
            }
        } catch {
            setHeart(wasLiked)
            setLikeCount(c => wasLiked ? c + 1 : c - 1)
        }
        setLikeLoading(false)
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

    return (
        <>
            {/* Navbar */}
            <Navbar>
                <Link to="/wifi">
                    <PrimaryButton text="Let's Feed" className='rounded-lg' />
                </Link>
            </Navbar>

            {/* Homepage Container */}
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

                {/* Videos Container */}
                <div className="h-100 w-[calc(100vw-300px)] p-7 overflow-auto flex items-center flex-col gap-14 snap-y snap-mandatory">
                    <div className="flex flex-row items-end justify-center gap-5 h-100 w-100 snap-center">
                        <VideoPlayer url={Video} />

                        {/* User Actions */}
                        <div className="flex flex-col gap-3">
                            {/* Heart with count */}
                            <div className="flex flex-col items-center gap-1">
                                <ClickableImage
                                    action={handleToggleLike}
                                    getAction={heart}
                                    src={HeartIcon}
                                />
                                <span className={`text-sm font-semibold ${heart ? 'text-primary' : 'text-black/50'}`}>
                                    {likeCount}
                                </span>
                            </div>
                            {/* Comment with count */}
                            <div className="flex flex-col items-center gap-1">
                                <ClickableImage action={() => setCommentOpen(true)} getAction={commentOpen} src={CommentIcon} />
                                <span className={`text-sm font-semibold ${commentOpen ? 'text-primary' : 'text-black/50'}`}>
                                    {comments.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Comment Drawer Overlay ── */}
            {commentOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-end" onClick={() => setCommentOpen(false)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                    {/* Drawer */}
                    <div
                        className="relative z-10 bg-white rounded-tl-2xl rounded-bl-2xl flex flex-col shadow-2xl"
                        style={{ width: '420px', height: 'calc(100vh - 89.09px)', marginTop: '89.09px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
                            <div>
                                <h2 className="text-lg font-bold text-black">Comments</h2>
                                <p className="text-xs text-black/40">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
                            </div>
                            <button
                                onClick={() => setCommentOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition text-black/50 hover:text-black text-xl font-light"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                            {comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-black/30">
                                    <img src={CommentIcon} alt="no comments" className="w-12 h-12 opacity-20" />
                                    <p className="text-sm">No comments yet. Be the first!</p>
                                </div>
                            ) : (
                                comments.map(c => (
                                    <div key={c._id} className="flex gap-3 group">
                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-primary">
                                                {c.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-semibold text-black">{c.username}</span>
                                                <span className="text-xs text-black/30">{formatTime(c.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-black/70 mt-0.5 break-words">{c.text}</p>
                                        </div>
                                        {/* Delete — only own comments */}
                                        {user?.userIdLogin === c.userId && (
                                            <button
                                                onClick={() => handleDeleteComment(c._id)}
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
                                        <span className="text-sm font-bold text-primary">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </span>
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
