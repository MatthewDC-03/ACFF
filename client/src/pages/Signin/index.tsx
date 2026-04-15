import Paw from "../../assets/svg/Pam.svg"
import Paw2 from "../../assets/svg/Pam_2.svg"
import Form from "../../components/Container/Form"
import FormField from "../../components/Fields/FormField"
import PrimaryButton from "../../components/Buttons/Primary"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { useLogin } from "../../hooks/useLogin"

const SignIn = () => {
    const [signin_username, setSigninUsername] = useState<string>('')
    const [signin_password, setSigninPassword] = useState<string>('')
    const { login, error } = useLogin()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect back to the page the user was trying to access, or home
    const from = (location.state as any)?.from?.pathname || '/'

    return (
        <div className="relative h-100 w-100 bg-[#C1CFA1]">
            <img src={Paw} alt="..." className="absolute bottom-0" />
            <img src={Paw2} alt="..." className="absolute right-0 top-0" />

            <div className="h-[100vh] w-100 flex justify-center items-center">
                <Form
                    submit={async (event) => {
                        event.preventDefault()
                        const result = await login(signin_username, signin_password)
                        if (result.success) {
                            navigate(from, { replace: true })
                        }
                    }}
                >
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1 className="text-4xl font-[1000] text-black max-sm:text-2xl">Welcome Back!</h1>
                        <p className="text-sm max-sm:text-xs max-sm:text-center">
                            Manage your cat's meals effortlessly and connect with fellow pet lovers!
                        </p>
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
                        onchange={(event) => setSigninUsername(event.target.value)}
                        value={signin_username}
                    />
                    <div className="w-full">
                        <FormField
                            placeholder="Enter your password"
                            label="Password"
                            type="password"
                            onchange={(event) => setSigninPassword(event.target.value)}
                            value={signin_password}
                        />
                    </div>

                    <PrimaryButton
                        text="Login"
                        className="rounded-full w-full py-4 text-lg max-sm:text-sm max-sm:py-2 md:text-md md:py-3"
                    />

                    <div className="relative w-full h-[1px] bg-black/50">
                        <span className="absolute px-4 py-0 left-1/2 top-1/2 bg-custom_white -translate-x-1/2 -translate-y-1/2 text-xs">or</span>
                    </div>

                    <h1 className="text-black text-md font-semibold max-sm:text-sm">New to FeederShare?
                        <Link to="/register">
                            <span className="text-primary cursor-pointer text-bold max-sm:text-sm"> Register now</span>
                        </Link>
                    </h1>
                </Form>
            </div>
        </div>
    )
}

export default SignIn