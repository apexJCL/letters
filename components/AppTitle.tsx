import React from 'react';

const colors =  [
  'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'
];


interface AppTitleProps {
  text: string;
}

const AppTitle: React.FC<AppTitleProps> = ({ text }) => {


  return (
    <div className="fredoka-one text-6xl">
      { text.split('').map((c, index) => (
        <span key={index} className="text-red-500">
          {c}
        </span>
      )) }
    </div>
  );
};


export default AppTitle;
