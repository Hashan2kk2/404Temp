import React, {useEffect, useState} from "react";
import {Select, SelectItem} from "@nextui-org/react";

const SelectWLabel = ({ label, className, options, handler, name, defaultSelectedItem,clearTrigger  }: {
    label: string,
    className?: string,
    options: Array<{ id: string, name: string }>,
    handler?: any,
    name?: string,
    defaultSelectedItem?: string,
    clearTrigger?: boolean
}) => {
    const [selectedValue, setSelectedValue] = useState<Set<string>>(new Set(defaultSelectedItem ? [String(defaultSelectedItem)] : []));

    useEffect(() => {
        if (defaultSelectedItem) {
            setSelectedValue(new Set([String(defaultSelectedItem)]));
        }
    }, [defaultSelectedItem]);

    useEffect(() => {
        setSelectedValue(new Set());
    }, [clearTrigger]);


    return (
        <Select
            labelPlacement="outside"
            label={label}
            placeholder="Select"
            className={className}
            selectedKeys={selectedValue}
            onChange={handler}
            name={name}
        >
            {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                    {option.name}
                </SelectItem>
            ))}
        </Select>
    );
};

export default SelectWLabel;