import React from "react";
import {Textarea} from "@nextui-org/react";

const TextAreaWLabel = ({label, rows, placeHolder, className, value, handler, name}: {
    label: string,
    rows: number,
    placeHolder: string,
    className?: string,
    value?: string,
    handler?: any,
    name?: string
}) => {
    return (
        <div className="col-span-full">
            <Textarea
                minRows={rows}
                label={label}
                labelPlacement="outside"
                placeholder={placeHolder}
                className={className}
                value={value}
                onChange={handler}
                name={name}
            />
        </div>
    )
}

export default TextAreaWLabel;