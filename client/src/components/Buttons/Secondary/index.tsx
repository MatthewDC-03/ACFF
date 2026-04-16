const SecondaryButton = ({text, className, onClick, disabled}: {
    text: string
    className: string,
    onClick: () => void,
    disabled: any
}) => {
    return(
        <button disabled={disabled} onClick={onClick} className={`${className} whitespace-pre border-2 border-primary text-primary py-3 px-10 font-medium rounded-lg text-md min-h-[44px] min-w-[44px]`} >{text}</button>
    )
}

export default SecondaryButton