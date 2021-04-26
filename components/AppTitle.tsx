import React from 'react';

const colors = [
  'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'
];


interface AppTitleProps {
  text: string;
}

const Letter: React.FC<{ char: string }> = ({char}) => {
  const color = colors[char.charCodeAt(0) % colors.length];
  const colorClass = `text-${color}-500`;
  return (
    <span className={colorClass}>
            {char}
        </span>
  );
}

const Word: React.FC<{ text: string }> = ({text}) => {
  const chars = text.split('');

  return (
    <div>
      {
        chars.map((c, index) => (
          <Letter key={index} char={c}/>
        ))
      }
    </div>
  );
}

const AppTitle: React.FC<AppTitleProps> = ({text}) => {
  const words: string[] = text.split(' ');

  return (
    <div className="fredoka-one text-5xl lg:text-8xl">
      {
        words.map((word, index) => (
          <Word key={index} text={word}/>
        ))
      }
    </div>
  );
};


export default AppTitle;
