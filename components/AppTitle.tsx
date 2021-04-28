import React, { useMemo } from 'react';
import ColorfulLetter from './ColorfulLetter';


interface AppTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

const Word: React.FC<{ text: string }> = ({text}) => {
  const chars = text.split('');

  return (
    <div>
      {
        chars.map((c, index) => (
          <ColorfulLetter key={index} char={c} />
        ))
      }
    </div>
  );
}

const AppTitle: React.FC<AppTitleProps> = ({text, className}) => {
  const words: string[] = text.split(' ');
  const classes = useMemo(() => `${className} fredoka-one text-5xl lg:text-8xl`, [className])

  return (
    <div className={classes}>
      {
        words.map((word, index) => (
          <Word key={index} text={word} />
        ))
      }
    </div>
  );
};


export default AppTitle;
