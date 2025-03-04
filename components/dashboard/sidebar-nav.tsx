import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Mail,
} from "lucide-react"

export const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Networking",
    href: "/dashboard/networking/cold-email",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
] 