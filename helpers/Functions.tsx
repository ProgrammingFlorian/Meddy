export const customLabel = (text: string, required?: true) => {
    return (
        <label htmlFor="select" className="font-bold block py-2 pb-0">{text}
            <label style={{color: "red", fontWeight: "normal"}}>{required ? " *" : ""}</label>
        </label>
    );
}


