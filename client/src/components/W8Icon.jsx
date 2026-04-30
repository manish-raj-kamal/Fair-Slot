import {
  Home,
  Zap,
  Calendar,
  CalendarCheck,
  BookOpen,
  Bell,
  User,
  Users,
  Building2,
  Building,
  LineChart,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
  Folder,
  Search,
  Settings,
  Check,
  CheckCircle,
  Clock,
  Coins,
  Shield,
  LayoutDashboard,
  Phone,
  Mail,
  MailOpen,
  Lock,
  LayoutGrid,
  Key,
  HelpCircle,
  UsersRound
} from 'lucide-react';

const ICONS = {
  home: Home,
  utilities: Zap,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  bookings: BookOpen,
  notifications: Bell,
  profile: User,
  users: Users,
  people: UsersRound,
  organizations: Building,
  building: Building2,
  analytics: LineChart,
  trend: TrendingUp,
  audit: ClipboardList,
  verification: ShieldCheck,
  'shield-check': ShieldCheck,
  folder: Folder,
  search: Search,
  admin: Shield,
  settings: Settings,
  check: Check,
  'check-circle': CheckCircle,
  clock: Clock,
  coins: Coins,
  shield: Shield,
  flat: LayoutDashboard,
  phone: Phone,
  email: Mail,
  'mail-open': MailOpen,
  lock: Lock,
  'lock-check': ShieldCheck,
  workspace: LayoutGrid,
  key: Key
};

export { ICONS };

export default function W8Icon({ id, name, size = 24, alt = '', className = '', style }) {
  const iconName = id || name;
  const IconComponent = ICONS[iconName] || HelpCircle;
  
  return (
    <IconComponent 
      size={size} 
      className={`w8-icon ${className}`} 
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }} 
      aria-label={alt || iconName || 'icon'} 
      strokeWidth={1.5}
    />
  );
}

