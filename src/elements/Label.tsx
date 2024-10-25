import React from 'react'

const Label = ({text, textColor, bgColor}: { text: string, textColor: string, bgColor: string }) => {
    return (
        <div className={`rounded-full capitalize p-1 px-3 w-fit text-sm ${textColor} ${bgColor}`}>
            {text}
        </div>
    )
}

export default Label
