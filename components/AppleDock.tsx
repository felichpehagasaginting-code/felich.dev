'use client';

import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { sounds } from '@/lib/sounds';

import { 
  Home, 
  User, 
  Briefcase, 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Mail 
} from 'lucide-react';

const dockItems = [
  { href: '/', icon: <Home className="w-6 h-6" />, label: 'Home', ariaLabel: 'Go to Home page' },
  { href: '/about', icon: <User className="w-6 h-6" />, label: 'About', ariaLabel: 'Go to About page' },
  { href: '/projects', icon: <Briefcase className="w-6 h-6" />, label: 'Projects', ariaLabel: 'Go to Projects page' },
  { href: '/achievements', icon: <GraduationCap className="w-6 h-6" />, label: 'Campus', ariaLabel: 'Go to Achievements page' },
  { href: '/dashboard', icon: <LayoutDashboard className="w-6 h-6" />, label: 'Stats', ariaLabel: 'Go to Dashboard page' },
  { href: '/blog', icon: <FileText className="w-6 h-6" />, label: 'Blog', ariaLabel: 'Go to Blog page' },
  { href: '/contact', icon: <Mail className="w-6 h-6" />, label: 'Contact', ariaLabel: 'Go to Contact page' },
];

function DockItem({
  href,
  icon,
  label,
  ariaLabel,
  mouseX,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  mouseX: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = pathname === href;
  const tooltipId = `dock-tooltip-${label.toLowerCase().replace(/\s/g, '-')}`;

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [45, 80, 45]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link
      href={href}
      onClick={() => sounds.playPop()}
      onMouseEnter={() => sounds.playHover()}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      aria-describedby={tooltipId}
    >
      <motion.div
        ref={ref}
        style={{ width }}
        className={`aspect-square rounded-2xl flex items-center justify-center relative group transition-colors ${
          isActive ? 'bg-primary/20 ring-2 ring-primary/40' : 'bg-white/5 hover:bg-white/10'
        } liquid-glass`}
      >
        <div className="text-neutral-700 dark:text-neutral-200 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        
        {/* Tooltip — role="tooltip" for ARIA association */}
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/80 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
        >
          {label}
        </div>
        
        {/* Active Dot */}
        {isActive && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_rgba(59,130,246,1)]" />
        )}
      </motion.div>
    </Link>
  );
}

export default function AppleDock() {
  const mouseX = useMotionValue(Infinity);
  const { theme } = useLayoutStore();

  if (theme !== 'apple') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] hidden md:block">
      {/* WCAG 2.4.1: nav landmark with descriptive label */}
      <nav aria-label="macOS-style Dock Navigation">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-end gap-3 px-4 py-3 rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-3xl liquid-glass shadow-2xl"
        >
          {dockItems.map((item) => (
            <DockItem key={item.href} {...item} mouseX={mouseX} />
          ))}
        </motion.div>
      </nav>
    </div>
  );
}
