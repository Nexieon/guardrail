import { AlertTriangle, CheckCircle2, Info, MessageSquare } from "lucide-react";
import { Card } from "./card";
import { JSX } from "react/jsx-runtime";
import Link from "next/link";

export interface NotificationItemData {
    id: string;
    user_id: string;
    title?: string;
    icon: NotificationIconType;
    message: string;
    link_url: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationItemProps {
    notif: NotificationItemData,
    onClick: () => void
}

export type NotificationIconType = 'done' | 'message' | 'warning' | 'info';

const iconMap: Record<NotificationIconType, JSX.Element> = {
    done: <CheckCircle2 className="h-5 w-5" />,
    message: <MessageSquare className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5y" />
};


export default function NotificationItem({notif, onClick}: NotificationItemProps) {
    let date = new Date(notif.created_at);

    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date).toLowerCase().replace(' ', '');

    return (
        <Link href={notif.link_url || "#"} onClick={onClick}>
            <Card 
                className={`flex flex-row items-start gap-4 p-4 sm:p-5 transition-all duration-200 ${notif.is_read ? 'opacity-70 bg-zinc-50' : 'bg-white shadow-sm border-brand-primary'}`}
            >
                {/* Icon Square */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-primary shadow-sm mt-0.5 text-white">
                    {iconMap[notif.icon] || iconMap['info']} 
                </div>
                
                {/* Text Content */}
                <div>
                <h4 className="text-sm font-bold text-black sm:text-base">
                    {notif.title} -  {` ${formattedTime} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} `}
                </h4>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm leading-relaxed">
                    {notif.message}
                </p>
                </div>
                
                {/* Unread Indicator Dot */}
                {!notif.is_read && (
                    <div className="h-2 w-2 rounded-full bg-brand-primary mt-2 shrink-0" />
                )}
            </Card>
        </Link>
    );
}