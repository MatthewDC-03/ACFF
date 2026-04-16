import Paw from "../../assets/svg/Pam.svg"
import Paw2 from "../../assets/svg/Pam_2.svg"
import Form from "../../components/Container/Form"
import FormField from "../../components/Fields/FormField"
import PrimaryButton from "../../components/Buttons/Primary"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSignup } from "../../hooks/useSignup"

const Register = () => {
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [cf_password, setCFpassword] = useState<string>('')
    const [cf_password_error, setCFPasswordError] = useState<boolean>(false)
    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    const { signup, error, isLoading } = useSignup()
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen w-full bg-[#C1CFA1] overflow-x-hidden">
            <img src={Paw} alt="..." className="absolute bottom-0 hidden md:block" />
            <img src={Paw2} alt="..." className="absolute right-0 top-0 hidden md:block" />

            {/* ── Success Popup ── */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-[340px] text-center animate-bounce-in">
                        {/* Green checkmark circle */}
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#80AF81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-black">Account Created!</h2>
                        <p className="text-black/50 text-sm">
                            Welcome to FeederShare, <span className="text-primary font-semibold">{username}</span>!
                            Your account has been successfully created.
                        </p>
                        <button
                            onClick={() => {
                                setShowSuccess(false)
                                navigate('/login')
                            }}
                            className="w-full bg-primary text-custom_white font-semibold py-3 rounded-xl hover:brightness-95 transition mt-2"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}

            <div className="min-h-screen w-full flex justify-center items-center">
                <Form
                    submit={async (event) => {
                        event.preventDefault()
                        setCFPasswordError(false)

                        if (password !== cf_password) {
                            setCFPasswordError(true)
                            return
                        }

                        const success = await signup(username, email, password)
                        if (success) {
                            setShowSuccess(true)
                        }
                    }}
                >
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1 className="text-4xl font-[1000] text-black">Welcome to FeederShare!</h1>
                        <p className="text-sm text-center">Create your account to effortlessly manage your cat's meals and join a
                            community of passionate pet lovers!</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/70 w-full p-2 rounded text-center font-medium text-custom_white">
                            <span>{error}</span>
                        </div>
                    )}

                    <FormField
                        placeholder="Enter your username"
                        label="Username"
                        type="text"
                        onchange={(event) => setUsername(event.target.value)}
                        value={username}
                    />
                    <FormField
                        placeholder="Enter your email"
                        label="Email"
                        type="email"
                        onchange={(event) => setEmail(event.target.value)}
                        value={email}
                    />
                    <FormField
                        placeholder="Enter your password"
                        label="Password"
                        type="password"
                        onchange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                    <FormField
                        placeholder="Enter your confirm password"
                        label="Confirm password"
                        type="confirm_password"
                        onchange={(event) => setCFpassword(event.target.value)}
                        value={cf_password}
                    />

                    {cf_password_error && (
                        <div className="w-full flex justify-start">
                            <h5 className="text-sm text-red-500">Password not match</h5>
                        </div>
                    )}

                    <PrimaryButton
                        text={isLoading ? "Creating account..." : "Register"}
                        className={`${isLoading ? "brightness-50 cursor-not-allowed" : ""} rounded-full w-full py-4 text-lg`}
                    />

                    <div className="relative w-full h-[1px] bg-black/50">
                        <span className="absolute px-4 left-1/2 top-1/2 bg-custom_white -translate-x-1/2 -translate-y-1/2">or</span>
                    </div>

                    <h1 className="text-black text-md font-semibold">Already part of FeederShare?
                        <Link to="/login">
                            <span className="text-primary cursor-pointer text-bold"> Login now</span>
                        </Link>
                    </h1>
                </Form>
            </div>
        </div>
    )
}

export default Register