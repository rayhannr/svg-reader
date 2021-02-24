import React, { ChangeEvent } from 'react'

interface Props{
    id: string
    onChange: (event: ChangeEvent) => void
    value: string
    isSelected: boolean
    label: string
}

const Radio: React.FC<Props> = props => {
    return (
        <label htmlFor={props.id} className="relative cursor-pointer text-xs mr-3">
            <input id={props.id} onChange={props.onChange} className="hidden" type="radio" value={props.value} checked={props.isSelected} />
            <span className={`${props.isSelected ? 'text-red-650 bg-gray-200' : 'text-gray-500'} inline-block py-2 px-3 font-semibold rounded-full hover:text-red-650`}>{props.label}</span>
        </label>
    )
}

export default Radio