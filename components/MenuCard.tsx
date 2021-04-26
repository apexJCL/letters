import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuCardProps {
  text: string;
  imgUrl: string;
  href: string;
}

const MenuCard: React.FC<MenuCardProps> = ({text, imgUrl, href}) => {
  return (
    <Link href={href}>
      <div
        className="transform transition duration-200 hover:scale-110 cursor-pointer text-blue-700 hover:text-green-500">
        <Image
          className="transform transition hover:rotate-6 hover:scale-75"
          src={imgUrl}
          width={180}
          height={180}
        />
        <p className="fredoka-one text-2xl text-center">
          {text}
        </p>
      </div>
    </Link>
  );
};

export default MenuCard;
