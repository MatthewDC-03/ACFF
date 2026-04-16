const PrimaryButton = ({text, className}: {
    text: string,
    className: string
}) => {
    return(
        <button className={`bg-primary text-white py-3 px-6 font-medium text-md min-h-[44px] min-w-[44px] ${className}`} >{text}</button>
    )
}

export default PrimaryButton