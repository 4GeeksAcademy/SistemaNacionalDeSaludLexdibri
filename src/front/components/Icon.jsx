import { icons, CircleHelp } from "lucide-react";

export const Icon = ({ name, size = "1em", className = "", strokeWidth = 2, ...props }) => {
    const LucideIcon = icons[name] || CircleHelp;

    return <LucideIcon aria-hidden="true" className={className} size={size} strokeWidth={strokeWidth} {...props} />;
};