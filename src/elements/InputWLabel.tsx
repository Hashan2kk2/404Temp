import React from "react";
import {Input} from "@nextui-org/react";

const InputWLabel = ({label, inputType, placeHolder, className, value, handler, name, ref}: {
    label: string,
    inputType: string,
    placeHolder: string,
    className?: string,
    value: string,
    handler: any,
    name: string
    ref?: any
}) => {
    return (
        <Input
            className={className}
            type={inputType}
            label={label}
            labelPlacement="outside"
            placeholder={placeHolder}
            value={value}
            onChange={handler}
            name={name}
            ref={ref}
        />
    );
};

export default InputWLabel;
