'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/plate', label: 'Plate Demo' },
    { href: '/grid', label: 'Grid' },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className={styles.header}>
            <h1>My App</h1>
            <nav className={styles.nav}>
                {navLinks.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={isActive ? styles.active : ''}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}