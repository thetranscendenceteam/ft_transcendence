import { ReactNode } from 'react';
import Link from 'next/link';
import { DropdownMenuItem } from './dropDownMenu'; // Replace with the actual path

interface StyledLinkProps {
  href: string;
  children: ReactNode;
}

const MenuLink = ({ href, children }: StyledLinkProps) => {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} passHref>
        {children}
      </Link>
    </DropdownMenuItem>
  );
};

export default MenuLink;