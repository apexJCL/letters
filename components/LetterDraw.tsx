import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
import pixel_match from 'pixelmatch';
import { useImageLoad } from '../utils/hooks';

const renderState = {
  capturing: false,
  mousePos: {x: 0, y: 0},
  lastPos: {x: 0, y: 0},
};

const letterWidth = 192;
const letterHeight = 384;
const canvasWidth = letterWidth * 2;
const canvasHeight = letterHeight * 2;
const letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYyZz';

const getCharXPosition = (char: string) => {
  const letterIndex = letters.indexOf(char);
  return letterWidth * letterIndex;
}

/**
 * Given the drawing canvas and the original font map, calculate the difference (in pixels).
 *
 * @param canvas
 * @param targetCharMapImg
 * @param char
 */
const compareDrawing = (canvas: HTMLCanvasElement, targetCharMapImg: HTMLImageElement, char: string): number => {
  const {width, height} = canvas;

  // First draw the target character to an in-memory canvas
  const localCanvas = document.createElement('canvas');
  localCanvas.width = width;
  localCanvas.height = height;
  const localCtx = localCanvas.getContext('2d');
  localCtx.drawImage(targetCharMapImg, getCharXPosition(char), 0, letterWidth, letterHeight, 0, 0, width, height);

  // Thereafter, obtain both canvas image data and compare
  const ctx = canvas.getContext('2d');
  const sourceImg = ctx.getImageData(0, 0, width, height).data;
  const targetImg = localCtx.getImageData(0, 0, width, height).data;

  return pixel_match(sourceImg, targetImg, null, width, height);
};

const renderCharacter = (canvas: HTMLCanvasElement, charMapImg: HTMLImageElement, char: string) => {
  if (!char) {
    // no-op
    return;
  }

  if (char.length > 1) {
    throw new Error("You can only render one character at a given time");
  }

  const ctx = canvas.getContext('2d');
  // Determine the letter position
  const posX = getCharXPosition(char);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(charMapImg, posX, 0, letterWidth, letterHeight, 0, 0, canvas.width, canvas.height);
};


const getTouchPosition = (canvas: HTMLCanvasElement, ev: TouchEvent) => {
  const rect = canvas.getBoundingClientRect();
  const singleTouch = ev.touches[0];

  return {
    x: singleTouch.clientX - rect.left,
    y: singleTouch.clientY - rect.top,
  };
};

const getMousePosition = (canvas: HTMLCanvasElement, ev: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ev.clientX - rect.left,
    y: ev.clientY - rect.top,
  }
};

/**
 * Initializes the canvas reference
 */
const useCanvasSetup = (): [HTMLCanvasElement, any] => {
  const [canvasNode, setCanvasNode] = useState(null);
  const setRef = useCallback((node: HTMLCanvasElement) => {
    if (!node) {
      setCanvasNode(null);
      return;
    }

    setCanvasNode(node);
  }, []);

  return [canvasNode, setRef];
};

/**
 * Configures the event listener for touch/mouse on the canvas.
 *
 * @param canvas - Canvas to be used
 * @param mouseEventCallback - Callback to use whenever any of the listeners is triggered.
 */
const useCanvasTouchListener = (canvas: HTMLCanvasElement, mouseEventCallback: (event: MouseEvent) => void) => {
  const onTouchStart = (ev: TouchEvent) => {
    const position = getTouchPosition(canvas, ev);
    const event = new MouseEvent('mousedown', {
      clientX: position.x,
      clientY: position.y,
    });
    canvas.dispatchEvent(event);
  };

  const onTouchMove = (ev: TouchEvent) => {
    const position = getTouchPosition(canvas, ev);
    const event = new MouseEvent('mousemove', {
      clientX: position.x,
      clientY: position.y,
    });
    canvas.dispatchEvent(event);
  };

  const onTouchEnd = () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  };

  const onMouseDown = (ev: MouseEvent) => {
    renderState.lastPos = getMousePosition(canvas, ev);
    renderState.capturing = true;
    mouseEventCallback(ev);
  };

  const onMouseUp = (ev: MouseEvent) => {
    renderState.capturing = false;
    mouseEventCallback(ev);
  };

  const onMouseMove = (ev: MouseEvent) => {
    if (!canvas) {
      return;
    }

    mouseEventCallback(ev);
    renderState.mousePos = getMousePosition(canvas, ev);
  };


  useEffect(() => {
    if (!canvas) {
      return;
    }

    // Set listeners
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    // Configure pencil
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';

    // Clean-up the previous event listeners
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [
    canvas,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  ]);

  const renderCanvas = (ctx: CanvasRenderingContext2D) => {
    const {lastPos, mousePos, capturing} = renderState;

    if (!capturing) {
      return
    }

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    ctx.closePath();
    renderState.lastPos = mousePos;
  };

  // Render setup
  useEffect(() => {
    window.requestAnimationFrame((callback) => {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        (window as any).mozRequestAnimationFrame ||
        (window as any).oRequestAnimationFrame ||
        (window as any).msRequestAnimaitonFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    function drawLoop() {
      if (!mounted || !canvas) {
        return;
      }

      requestAnimationFrame(drawLoop);
      renderCanvas(canvas.getContext('2d'));
    }

    drawLoop();

    return () => {
      mounted = false;
    }
  }, [canvas]);
};

type LetterDrawProps = {
  /**
   * Letter to render, must be a single character
   */
  character: string;
};

interface LetterDrawElement {
  getCanvas: () => HTMLCanvasElement;
  clearCanvas: () => void;
  getImageData: () => ImageData;
  /**
   * Calculates the pixel difference between the expected drawing and the
   * user-captured drawing.
   */
  calculateDifference: () => number;
}

const LetterDraw = React.forwardRef<LetterDrawElement, LetterDrawProps>(({character, ...rest}, ref) => {
  const [strokes, setStrokes] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [canvasCleared, setCanvasCleared] = useState(false);
  const [canvas, setCanvasRef] = useCanvasSetup();
  const [strokesImage, isImageLoaded] = useImageLoad('/images/letters-stroke.png');
  const [targetImage, isTargetImageLoaded] = useImageLoad('/images/letters-regular.png');

  const onMouseEvent = useCallback((event: MouseEvent) => {
    switch (event.type) {
      case 'mouseup':
        setStrokes(strokes + 1);
        break;
      default:
        return;
    }
  }, [canvas, strokes]);

  // Setup touch/click listener for drawing/data storing for matching
  useCanvasTouchListener(canvas, onMouseEvent);

  // Clears canvas whenever the character changes
  useEffect(() => setCanvasCleared(true), [character]);

  // Setup target character to render in order for user to draw
  useEffect(() => {
    if (!canvas || !isImageLoaded || !canvasCleared) {
      return;
    }

    renderCharacter(canvas, strokesImage, character);
    setCanvasCleared(false);
    setStrokes(0);
  }, [canvas, isImageLoaded, character, strokesImage, canvasCleared]);

  // Calculates the accuracy after every stroke
  useEffect(() => {
    if (!canvas) {
      return;
    }

    setAccuracy(compareDrawing(canvas, targetImage, character))
  }, [strokes, canvas, targetImage, character]);

  const clearCanvas = useCallback(() => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    setCanvasCleared(true);
  }, [canvas, setCanvasCleared]);

  const getImageData = useCallback(() => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), [canvas]);

  const calculateDifference = useCallback(() => {
    if (!character) {
      return -1
    }

    return compareDrawing(canvas, targetImage, character);
  }, [canvas, targetImage, character]);

  useImperativeHandle(ref, () => ({
    ...rest,
    getCanvas: () => canvas,
    clearCanvas,
    getImageData,
    calculateDifference,
  }), [canvas]);

  return (
    <canvas
      ref={setCanvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="border-2"
    />
  );
});

export type LetterDrawHandle = React.ElementRef<typeof LetterDraw>;

export default LetterDraw;