import React, { useMemo, useRef } from 'react';
import ColorfulLetter from './ColorfulLetter';
import Image from 'next/image';

interface LetterButtonProps {
  character: string;
}

const LowercaseLetter: React.FC<{ char: string }> = ({char}) => {
  return (
    <ColorfulLetter char={char.toLowerCase()} />
  );
};

const UppercaseLetter: React.FC<{ char: string }> = ({char}) => {
  return (
    <ColorfulLetter char={char.toUpperCase()} />
  );
};

const LetterButton: React.FC<LetterButtonProps> = ({character}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const imgSrc = useMemo(() => `/images/soundboard/${character.toLowerCase()}.jpg`, [character]);
  const audioSrc = useMemo(() => `/sounds/soundboard/${character.toLowerCase()}.mp3`, [character]);

  return (
    <button
      className="rounded-lg shadow-lg p-6 flex justify-center space-y-4 items-center p-2 w-96 md:flex-col cursor-pointer focus:outline-none transform scale-90 hover:scale-100 focus:scale-100 transition duration-200"
      onClick={async () => {
        if (!audioRef.current || !audioRef.current.paused) {
          return;
        }

        await audioRef.current.play();
      }}
    >
      <Image
        width={196}
        height={196}
        src={imgSrc}
      />
      <div className="text-8xl md:text-9xl fredoka-one flex justify-center space-x-4">
        <UppercaseLetter char={character} />
        <LowercaseLetter char={character} />
      </div>
      <audio ref={audioRef} src={audioSrc} />
    </button>
  );
};

export default LetterButton;
