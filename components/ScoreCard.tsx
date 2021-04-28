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
      "w-56",
      "h-36",
      "transform",
      "-translate-x-1/2",
      "flex",
      "flex-col",
      "justify-center",
      "items-center",
      "space-y-4",
    ];

    if (visible) {
      classList.push("");
    } else {
      classList.push("hidden")
    }

    return classList.join(" ");
  }, [visible]);

  const textCssClasses = useMemo(() => {
    const classes = ["text-center", "fredoka-one"];

    switch (score) {
      case 3:
        classes.push("text-green-500");
        break;
      case 2:
        classes.push("text-blue-500");
        break;
      default:
        classes.push("text-indigo-700");
        break;
    }

    return classes.join(" ");
  }, [score]);

  let message;

  if (score === 3) {
    message = (
      <>
        ¡Felicidades!
        <br />
        Lo has hecho muy bien
      </>
    );
  } else if (score === 2) {
    message = (
      <>
        ¡Bien!
        <br/>
        Pero puedes hacerlo mejor
      </>
    );
  } else {
    message = "Sígue esforzándote, tú puedes lograrlo";
  }

  const children = Array.from(Array(maxScore).keys()).map((index) => {
    const imgSrc = (index + 1) <= score ? '/images/star-filled.png' : '/images/star-outline.png';

    return (
      <img key={index} width={48} height={48} src={imgSrc} alt="star" />
    );
  });

  return (
    <div className={cssClasses}>
      <div className="flex flex-wrap items-center justify-center space-x-2">
        {children}
      </div>
      <p className={textCssClasses}>
        {message}
      </p>
    </div>
  );
};

ScoreCard.defaultProps = {
  visible: true,
  maxScore: 3,
};

export default ScoreCard;
