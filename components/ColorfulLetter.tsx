import React from 'react';

const colors = [
  'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'
];

interface ColorfulLetterProps {
  char: string;
  /**
   * Tailwind text color class
   */
  colorClassName?: string;
}

const ColorfulLetter: React.FC<ColorfulLetterProps> = ({char, colorClassName}) => {
  const color = colorClassName || colors[char.charCodeAt(0) % colors.length];
  const colorClass = `text-${color}-500`;
  return <span className={colorClass}>{char}</span>;
}

export default ColorfulLetter;
