"use client"; // Ensure this component is a client component

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// Dummy Breadcrumb components for illustration
interface BreadcrumbProps {
  children: ReactNode;
}

const Breadcrumb = ({ children }: BreadcrumbProps) => <nav>{children}</nav>;

const BreadcrumbItem = ({ children }: BreadcrumbProps) => <span>{children}</span>;

interface BreadcrumbLinkProps {
  children: ReactNode;
  href: string;
}

const BreadcrumbLink = ({ children, href }: BreadcrumbLinkProps) => (
  <Link href={href}>
    {children}
  </Link>
);

const BreadcrumbList = ({ children }: BreadcrumbProps) => <div>{children}</div>;

function DbBreadcrumb() {
  const pathname = usePathname();

  // Function to derive page name from pathname
  const getPageName = (path: string): string => {
    const parts = path.split('/').filter(Boolean); // Split path and filter empty parts

    // Handle the case for root URL
    if (parts.length === 0) {
      return "Home"; // Return a default name for the root URL
    }

    const pageName = parts[parts.length - 1]; // Get last part of the path
    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
  };

  const pageName = getPageName(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{pageName}</BreadcrumbLink> {/* Change link to root */}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DbBreadcrumb;
