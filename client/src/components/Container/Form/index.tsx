import React from "react"
import Direct from "../../ClickableElement/Direct"
import CatImage from "../../../assets/svg/cat.svg"
import MainIcon from "../../../assets/svg/main_icon.svg"
const Form = ({children, submit}: {
    children: React.ReactNode,
    submit: (event: React.FormEvent<HTMLFormElement>) => void
}) =>{
    return(
        /* Outer card — full screen on mobile, centered card on desktop */
        <div className="w-full min-h-screen flex flex-col z-10 bg-custom_white
                        lg:w-4/6 lg:min-h-0 lg:h-[90vh] lg:max-h-[700px] lg:flex-row lg:rounded-2xl lg:shadow-2xl lg:overflow-hidden
                        xl:w-3/5 xl:h-[85vh] xl:max-h-[750px]">

            {/* ── Left branding panel ── */}
            <div className="relative flex flex-col justify-between bg-custom-gradient overflow-hidden
                            w-full flex-shrink-0 min-h-[200px] sm:min-h-[220px]
                            lg:w-[45%] lg:min-h-0 lg:h-full">

                {/* Text content */}
                <div className="flex flex-col gap-3 p-5 lg:gap-6 lg:p-8 z-10">
                    <Direct
                        image={MainIcon}
                        size={40}
                        text="FeederShare"
                        color="text-white"
                        filter="brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(116deg) brightness(109%) contrast(109%)"
                        font_size="text-xl lg:text-2xl xl:text-3xl"
                    />
                    {/* Show heading/desc on all breakpoints, sized appropriately */}
                    <h1 className="text-custom_white font-extrabold text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-tight">
                        AUTOMATIC CAT FOOD FEEDER
                    </h1>
                    <p className="text-custom_white/80 text-xs sm:text-sm lg:text-sm xl:text-base leading-relaxed">
                        Welcome to FeederShare! Easily manage your cat's feeding schedule and connect with other pet owners through our social media features.
                    </p>
                </div>

                {/* Cat image — sits at the bottom of the panel */}
                <div className="hidden lg:flex w-full justify-center items-end">
                    <div className="w-full bg-custom_white rounded-t-[120px] flex justify-center items-center pt-4 pb-0">
                        <img src={CatImage} alt="cat" className="w-56 xl:w-64 object-contain" />
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <form
                className="flex-1 bg-custom_white flex flex-col justify-evenly items-center p-6 gap-5
                           lg:p-8 lg:gap-6 lg:overflow-y-auto"
                onSubmit={submit}
                method="POST"
            >
                {children}
            </form>
        </div>
    )
}

export default Form