import React, { useCallback, useEffect, useRef, useState } from 'react';
import LetterDraw, { LetterDrawHandle } from "../components/LetterDraw";
import { letterMap } from '../utils/misc';
import Image from 'next/image';
import ScoreCard from '../components/ScoreCard';
import Link from 'next/link';


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
    const letter = letterMap.charAt(Math.floor(Math.random() * letterMap.length));
    onUseRandomLetter(letter);
  }

  return (
    <div
      className="flex items-center justify-center space-x-8 bottom-2 absolute bg-white p-4 shadow"
    >
      <Link href="/">
        <button className="transform hover:scale-100 scale-75 transition duration-150 focus:outline-none">
          <Image src="/images/back.png" width={42} height={42} />
        </button>
      </Link>
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
  const [scoreCardVisible, setScoreCardVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [letter, setLetter] = useState(letterMap.charAt(Math.floor(Math.random() * letterMap.length)));
  const letterRef = useRef<LetterDrawHandle>(null);

  const resetScore = useCallback(() => {
    setScoreCardVisible(false);
    setScore(0);
  }, []);

  const onClear = () => {
    if (!letterRef.current) {
      return
    }

    letterRef.current.clearCanvas();
    resetScore();
  }

  const onOk = useCallback(() => {
    if (!letterRef.current) {
      return;
    }

    const floatScore = letterRef.current.calculateScore();

    /**
     * Scoring is:
     * score < 0.7 = 1 star
     * 0.8 <= score < 0.9 = 2 stars
     * >= 0.9 = 3 stars
     */

    console.log('score is', floatScore);
    if (floatScore >= 0.9) {
      setScore(3);
    } else if (floatScore >= 0.8) {
      setScore(2);
    } else {
      setScore(1);
    }

    setScoreCardVisible(true);
  }, [letterRef]);

  useEffect(() => resetScore(), [letter]);

  return (
    <div className="relative flex justify-center h-full">
      <LetterDraw
        ref={letterRef}
        character={letter}
      />
      <ScoreCard score={score} visible={scoreCardVisible} />
      <ActionBar
        onOk={onOk}
        onClear={onClear}
        onUseRandomLetter={setLetter}
      />
    </div>
  );
};

export default Page;
