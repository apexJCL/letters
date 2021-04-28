import React, { useMemo } from 'react';

interface ScoreCardProps {
  visible?: boolean;
  maxScore?: number;
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({visible, score, maxScore}) => {
  if (!visible) {
    return null;
  }

  const cssClasses = useMemo(() => {
    const classList = [
      "absolute",
      "inset-1/2",
      "shadow", "bg-white",
      "rounded",
      "w-48",
      "h-20",
      "transform",
      "-translate-x-1/2",
      "flex",
      "items-center",
      "justify-center",
      "space-x-2",
    ];

    if (visible) {
      classList.push("");
    } else {
      classList.push("hidden")
    }

    return classList.join(" ");
  }, [visible]);

  const children = Array.from(Array(maxScore).keys()).map((index) => {
    const imgSrc = (index + 1) <= score ? '/images/star-filled.png' : '/images/star-outline.png';

    return (
      <img key={index} width={48} height={48} src={imgSrc} alt="star" />
    );
  });

  return (
    <div className={cssClasses}>
      {children}
    </div>
  );
};

ScoreCard.defaultProps = {
  visible: true,
  maxScore: 3,
};

export default ScoreCard;
