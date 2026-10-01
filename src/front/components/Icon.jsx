import {
    Activity,
    Ambulance,
    Atom,
    Baby,
    Bone,
    Brain,
    CalendarDays,
    ChartNoAxesCombined,
    Check,
    Circle,
    CircleCheck,
    CircleX,
    CircleHelp,
    Clock3,
    Cloud,          // <-- Clima
    CloudDrizzle,   // <-- Clima
    CloudFog,       // <-- Clima
    CloudLightning, // <-- Clima
    CloudOff,       // <-- Clima
    CloudRain,      // <-- Clima
    CloudSnow,      // <-- Clima
    CloudSun,       // <-- Clima
    Dna,
    Droplet,
    Droplets,
    Eye,
    EyeOff,
    FlaskConical,
    Globe2,
    Heart,
    HeartPulse,
    Hospital,
    Info,
    KeyRound,
    Leaf,
    LoaderCircle,   // <-- Spinner
    LockKeyhole,
    LogIn,
    LogOut,
    Mail,
    MapPin,
    MessageCircle,
    Microscope,
    Plane,
    Pill,
    Phone,
    Plus,
    Search,
    SearchX,
    ScanFace,
    ScanLine,
    Scale,
    Scissors,
    Settings,
    Shield,
    ShieldCheck,
    Siren,
    Smile,
    Sparkles,
    Stethoscope,
    Sun,            // <-- Clima
    Syringe,
    Utensils,
    User,
    UserRound,
    Users,
    Video,
    Wind,
    Bug,
} from "lucide-react";

const icons = {
    Activity,
    Ambulance,
    Atom,
    Baby,
    Bone,
    Brain,
    CalendarDays,
    ChartNoAxesCombined,
    Check,
    Circle,
    CircleCheck,
    CircleX,
    CircleHelp,
    Clock3,
    Cloud,          // <-- Clima
    CloudDrizzle,   // <-- Clima
    CloudFog,       // <-- Clima
    CloudLightning, // <-- Clima
    CloudOff,       // <-- Clima
    CloudRain,      // <-- Clima
    CloudSnow,      // <-- Clima
    CloudSun,       // <-- Clima
    Dna,
    Droplet,
    Droplets,
    Eye,
    EyeOff,
    FlaskConical,
    Globe2,
    Heart,
    HeartPulse,
    Hospital,
    Info,
    KeyRound,
    Leaf,
    LoaderCircle,   // <-- Spinner
    LockKeyhole,
    LogIn,
    LogOut,
    Mail,
    MapPin,
    MessageCircle,
    Microscope,
    Plane,
    Pill,
    Phone,
    Plus,
    Search,
    SearchX,
    ScanFace,
    ScanLine,
    Scale,
    Scissors,
    Settings,
    Shield,
    ShieldCheck,
    Siren,
    Smile,
    Sparkles,
    Stethoscope,
    Sun,            // <-- Clima
    Syringe,
    Utensils,
    User,
    UserRound,
    Users,
    Video,
    Wind,
    Bug,
};

export const Icon = ({ name, size = "1em", className = "", ...props }) => {
    const IconComponent = icons[name] || CircleHelp;

    return (
        <IconComponent
            aria-hidden="true"
            className={className}
            size={size}
            {...props}
        />
    );
};