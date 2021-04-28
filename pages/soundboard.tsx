import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LetterButton from '../components/LetterButton';
import { letters } from '../utils/misc';

const Page: React.FC = () => {
  return (
    <div>
      <Link href="/">
        <button className="p-4 flex items-center">
          <Image width={48} height={48} src="/images/back.png" />
          <span className="ml-6 fredoka-one text-blue-500 text-2xl">Volver</span>
        </button>
      </Link>
      <div className="flex flex-wrap space-x-4 space-y-4">
        {
          letters.map(l => (
            <LetterButton key={l} character={l} />
          ))
        }
      </div>
    </div>
  );
};

export default Page;
