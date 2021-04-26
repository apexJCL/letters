import React, {useCallback, useRef, useState} from 'react';
import LetterDraw, {LetterDrawHandle, letters} from "../components/LetterDraw";
import Image from 'next/image';


interface ActionBarProps {
  onClear: () => void;
  onUseRandomLetter: (letter: string) => void;
  onOk: () => void;
}

const ActionBar: React.FC<ActionBarProps> = (
  {
    onClear,
    onUseRandomLetter,
    onOk,
  }
) => {
  const onRandomLetterClick = () => {
    const letter = letters.charAt(Math.floor(Math.random() * letters.length));
    onUseRandomLetter(letter);
  }

  return (
    <div
      className="flex items-center space-x-8 bottom-0 absolute bg-white p-4 shadow"
    >
      <button
        className="fredoka-one text-3xl transform hover:-rotate-12 transition duration-150 cursor-pointer focus:outline-none"
        onClick={onRandomLetterClick}
      >
        <span className="text-pink-500">A</span><span className="text-blue-500">Z</span>
      </button>
      <button
        onClick={onClear}
        className="cursor-pointer transition duration-150 transform hover:rotate-45 focus:outline-none"
      >
        <Image
          src="/images/refresh.png"
          width={42}
          height={42}
        />
      </button>
      <button
        className="cursor-pointer transition duration-150 transform hover:scale-105 focus:outline-none"
        onClick={onOk}
      >
        <Image
          src="/images/checkmark.png"
          width={42}
          height={42}
        />
      </button>
    </div>
  );
};

const Page: React.FC = () => {
  const [letter, setLetter] = useState("A");
  const letterRef = useRef<LetterDrawHandle>(null);

  const onClear = () => {
    if (!letterRef.current) {
      return
    }

    letterRef.current.clearCanvas();
  }

  const onStrokeChange = useCallback((strokes, maxStrokesAllowed) => {
    if (strokes < maxStrokesAllowed) {
      return;
    }

    const pixelDifference = letterRef.current.calculateDifference();
  }, []);

  const onOk = useCallback(() => {
    if (!letterRef.current) {
      return;
    }

    console.log(letterRef.current.calculateDifference());
  }, [letterRef]);

  return (
    <div className="relative flex justify-center">
      <LetterDraw
        ref={letterRef}
        character={letter}
      />
      <ActionBar
        onOk={onOk}
        onClear={onClear}
        onUseRandomLetter={setLetter}
      />
    </div>
  );
};

export default Page;
