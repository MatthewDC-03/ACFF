const FormField = ({placeholder, label, type,onchange,value}:{
    placeholder: string,
    label: string,
    type: string,
    onchange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    value: string
}) =>{
    return(
        <div className="w-full h-fit flex flex-col gap-1" >
            <label className={`text-md font-semibold ${value ? "text-primary" : "text-black"}
                                max-sm:text-xs
            `} htmlFor={type}>{label}</label>
            <input
            value={value}
            onChange={onchange}
            className={`
            ${value ? 'border-primary border-[2px]' : 'border-black'}
            text-lg py-2 px-4 rounded-md border-[1px] outline-none min-h-[44px]
            max-sm:text-sm
            md:text-md
            `} type={type === "confirm_password" ? "password" : type} name={type} id={type === "confirm_password" ? "confirm_password" : type} placeholder={placeholder}/>
        </div>
    )
}

export default FormField