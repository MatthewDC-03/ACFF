import AppLayout from "../../components/AppLayout"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import DirectSidebar from "../../components/ClickableElement/DirectSidebar"
import Profile from "../../assets/svg/profile.svg"
import Homes from "../../assets/svg/home.svg"
import PrimaryButton from "../../components/Buttons/Primary"
import { useApi } from "../../hooks/useApi"

const ProfilePage = () => {
    const { user, dispatch } = useAuthContext()
    const navigate = useNavigate()
    const { apiCall } = useApi()

    // About state
    const [about, setAbout] = useState('')
    const [editingAbout, setEditingAbout] = useState(false)
    const [aboutDraft, setAboutDraft] = useState('')
    const [aboutLoading, setAboutLoading] = useState(false)
    const [aboutError, setAboutError] = useState('')

    // Stats state
    const [totalVideos, setTotalVideos] = useState(0)
    const [followers, setFollowers] = useState(0)
    const [likes, setLikes] = useState(0)

    // Activity state
    const [activity, setActivity] = useState<{timestamp: string, status: string, result?: string}[]>([])

    // Username update state
    const [newUsername, setNewUsername] = useState('')
    const [usernamePassword, setUsernamePassword] = useState('')
    const [usernameLoading, setUsernameLoading] = useState(false)
    const [usernameError, setUsernameError] = useState('')
    const [usernameSuccess, setUsernameSuccess] = useState('')

    // Password update state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')

    useEffect(() => {
        if (!user) { navigate('/login'); return }

        // Allow normal scroll on this page only
        document.body.style.overflow = 'auto'
        document.body.style.height = 'auto'

        return () => {
            // Restore when leaving the page
            document.body.style.overflow = ''
            document.body.style.height = '100vh'
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!user) return
        // Fetch user data to get saved about
        const fetchUser = async () => {
            try {
                const res = await apiCall(`/api/user/${user.userIdLogin}`)
                if (res.ok) {
                    const data = await res.json()
                    setAbout(data.about || '')
                    setAboutDraft(data.about || '')
                    setTotalVideos(data.totalVideos ?? 0)
                    setFollowers(data.followers ?? 0)
                    setLikes(data.likes ?? 0)
                }
            } catch { /* silent */ }
        }

        const fetchActivity = async () => {
            try {
                const res = await apiCall(`/api/user/${user.userIdLogin}/recent-activity`)
                if (res.ok) {
                    const data = await res.json()
                    setActivity(data)
                }
            } catch { /* silent */ }
        }

        fetchUser()
        fetchActivity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    if (!user) return null

    const userId = user.userIdLogin
    const avatarLetter = user.username?.charAt(0).toUpperCase() || '?'

    // ── About ──
    const handleSaveAbout = async () => {
        setAboutLoading(true)
        setAboutError('')
        try {
            const res = await apiCall(`/api/user/${userId}/update-about`, {
                method: 'PATCH',
                body: JSON.stringify({ about: aboutDraft }),
            })
            if (res.ok) {
                setAbout(aboutDraft)
                setEditingAbout(false)
            } else {
                const data = await res.json()
                setAboutError(data.error || 'Failed to save')
            }
        } catch {
            setAboutError('Something went wrong.')
        }
        setAboutLoading(false)
    }

    // ── Username ──
    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault()
        setUsernameError(''); setUsernameSuccess('')
        if (!newUsername.trim()) { setUsernameError('New username is required'); return }
        setUsernameLoading(true)
        try {
            const res = await apiCall(`/api/user/${userId}/update-username`, {
                method: 'PATCH',
                body: JSON.stringify({ newUsername, currentPassword: usernamePassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setUsernameError(data.error)
            } else {
                setUsernameSuccess('Username updated successfully!')
                const updatedUser = { ...user, username: newUsername }
                localStorage.setItem('user', JSON.stringify(updatedUser))
                dispatch({ type: 'LOGIN', payload: updatedUser })
                setNewUsername(''); setUsernamePassword('')
            }
        } catch { setUsernameError('Something went wrong. Try again.') }
        setUsernameLoading(false)
    }

    // ── Password ──
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError(''); setPasswordSuccess('')
        if (newPassword !== confirmPassword) { setPasswordError('New passwords do not match'); return }
        setPasswordLoading(true)
        try {
            const res = await apiCall(`/api/user/${userId}/update-password`, {
                method: 'PATCH',
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setPasswordError(data.error)
            } else {
                setPasswordSuccess('Password updated successfully!')
                setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
            }
        } catch { setPasswordError('Something went wrong. Try again.') }
        setPasswordLoading(false)
    }

    const sidebarContent = (
        <div className="flex flex-col gap-10">
            <Link to="/">
                <DirectSidebar
                    image={Homes} size={28} text="For You" color="text-black"
                    filter="brightness(0) saturate(100%) invert(0%) sepia(86%) saturate(19%) hue-rotate(252deg) brightness(94%) contrast(76%)"
                    font_size="text-xl"
                />
            </Link>
            <DirectSidebar
                image={Profile} size={28} text="Profile" color="text-primary"
                filter="brightness(0) saturate(100%) invert(73%) sepia(7%) saturate(1468%) hue-rotate(72deg) brightness(88%) contrast(86%)"
                font_size="text-xl"
            />
        </div>
    )

    return (
        <AppLayout
            navbarChildren={
                <Link to="/wifi">
                    <PrimaryButton text="Let's Feed" className='rounded-lg' />
                </Link>
            }
            sidebarChildren={sidebarContent}
        >
                {/* Main content — scrolls naturally */}
                <div className="flex-1 p-4 md:p-7 flex flex-col gap-8 pb-16 md:pb-0">

                    {/* ── Profile Header ── */}
                    <div className="bg-custom-gradient rounded-2xl p-8 text-custom_white shadow-lg">
                        <div className="flex items-center gap-4 md:gap-6">
                            {/* Avatar — first letter of username */}
                            <div className="w-24 h-24 bg-custom_white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                                <span className="text-4xl font-bold text-primary">{avatarLetter}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
                                <p className="text-custom_white/80 mt-1 text-sm">FeederShare Member</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Videos', value: totalVideos },
                            { label: 'Followers', value: followers },
                            { label: 'Likes', value: likes },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
                                <h3 className="text-black/50 text-sm font-semibold">{s.label}</h3>
                                <p className="text-3xl font-bold text-primary mt-2">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── About (editable) ── */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20">
                            <h2 className="text-xl font-bold text-black">About</h2>
                            {!editingAbout && (
                                <button
                                    onClick={() => { setEditingAbout(true); setAboutDraft(about) }}
                                    className="text-sm text-primary font-semibold hover:underline"
                                >
                                    {about ? 'Edit' : '+ Add About'}
                                </button>
                            )}
                        </div>
                        <div className="p-6">
                            {editingAbout ? (
                                <div className="flex flex-col gap-3">
                                    <textarea
                                        rows={4}
                                        value={aboutDraft}
                                        onChange={e => setAboutDraft(e.target.value)}
                                        placeholder="Tell others a bit about yourself..."
                                        className="w-full border border-primary/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                                    />
                                    {aboutError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{aboutError}</p>}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSaveAbout}
                                            disabled={aboutLoading}
                                            className={`bg-primary text-custom_white font-semibold px-5 py-2 rounded-lg text-sm transition hover:brightness-95 ${aboutLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {aboutLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => setEditingAbout(false)}
                                            className="border border-primary/40 text-black/60 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-primary/5 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-black/50 leading-relaxed">
                                    {about || 'No about info yet. Click "+ Add About" to write something.'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Recent Activity ── */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-black mb-4">Recent Activity</h2>
                        {activity.length === 0 ? (
                            <p className="text-black/40 text-sm">No recent activity yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {activity.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'success' ? 'bg-primary' : 'bg-red-400'}`}></span>
                                            <span className="text-black/70 text-sm">
                                                Feed — <span className="font-medium">{item.status}</span>
                                                {item.result ? ` · ${item.result}` : ''}
                                            </span>
                                        </div>
                                        <span className="text-black/40 text-xs flex-shrink-0 ml-4">{item.timestamp}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Account Settings ── */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-primary/20 px-6 py-4 border-b border-primary/30">
                            <h2 className="text-xl font-bold text-black">Account Settings</h2>
                            <p className="text-black/50 text-sm mt-1">Manage your username and password</p>
                        </div>

                        <div className="p-6 flex flex-col gap-8">

                            {/* Change Username */}
                            <div>
                                <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                                    Change Username
                                </h3>
                                <form onSubmit={handleUpdateUsername} className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-black/60">New Username</label>
                                        <input
                                            type="text"
                                            placeholder="Enter new username"
                                            value={newUsername}
                                            onChange={e => setNewUsername(e.target.value)}
                                            className="border border-primary/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-black/60">Current Password <span className="text-black/30">(to confirm)</span></label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            value={usernamePassword}
                                            onChange={e => setUsernamePassword(e.target.value)}
                                            className="border border-primary/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                        />
                                    </div>
                                    {usernameError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{usernameError}</p>}
                                    {usernameSuccess && <p className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">{usernameSuccess}</p>}
                                    <button
                                        type="submit"
                                        disabled={usernameLoading}
                                        className={`self-start bg-primary text-custom_white font-semibold px-6 py-2.5 rounded-lg text-sm transition hover:brightness-95 ${usernameLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {usernameLoading ? 'Saving...' : 'Update Username'}
                                    </button>
                                </form>
                            </div>

                            <hr className="border-primary/20" />

                            {/* Change Password */}
                            <div>
                                <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                                    Change Password
                                </h3>
                                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-black/60">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            className="border border-primary/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-black/60">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="border border-primary/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-black/60">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="border border-primary/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                                        />
                                    </div>
                                    <p className="text-xs text-black/40">
                                        Must be at least 8 characters with uppercase, lowercase, number and symbol.
                                    </p>
                                    {passwordError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{passwordError}</p>}
                                    {passwordSuccess && <p className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">{passwordSuccess}</p>}
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className={`self-start bg-primary text-custom_white font-semibold px-6 py-2.5 rounded-lg text-sm transition hover:brightness-95 ${passwordLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {passwordLoading ? 'Saving...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>

                </div>

        </AppLayout>
    )
}

export default ProfilePage
