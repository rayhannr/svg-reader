import React, { useState, useEffect } from "react"
import "./Tooltip.css"

interface Props {
    direction?: 'top' | 'left' | 'right' | 'bottom' 
    content: string
    allowed?: boolean
}

const Tooltip: React.FC<Props> = (props) => {
    const [active, setActive] = useState(false)
    const isAllowed: boolean = props.allowed ?? true

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if(active){
            timeout = setTimeout(() => {
                setActive(false)
            }, 500);
        }
        
        return () => clearTimeout(timeout)
    }, [active])

    const showTip = () => {
        setActive(true)
    }

    return (
        <div
            className="inline-block relative"
            onClick={showTip}
        >
            {props.children}
            {active && isAllowed && (
                <div className={`Tooltip-Tip absolute rounded p-2 text-gray-850 bg-gray-200 leading-none z-50 whitespace-nowrap text-sm font-medium ${props.direction || "top"}`}>
                    {props.content}
                </div>
            )}
        </div>
    )
}

export default Tooltip