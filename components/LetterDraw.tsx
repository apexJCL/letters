import React, {useCallback, useEffect, useImperativeHandle, useState} from "react";

type LetterDrawProps = {
    /**
     * Letter to render, must be a single character
     */
    character: string;
};

const renderState = {
    capturing: false,
    mousePos: {x: 0, y: 0},
    lastPos: {x: 0, y: 0},
};

const letterWidth = 160;
const letterHeight = 288;
const canvasWidth = letterWidth * 2;
const canvasHeight = letterHeight * 2;
const letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYyZz';

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
 * Hook that lets you know when an image has been loaded
 */
const useImageLoad = (src: string): [HTMLImageElement, boolean] => {
    const [image, setImage] = useState<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setImage(null);
        setLoaded(false);

        const img = new Image();
        setImage(img);

        img.addEventListener('load', () => {
            setLoaded(true);
        });

        img.src = src;
    }, [src]);

    return [image, loaded];
};

const drawCharacter = (canvas: HTMLCanvasElement, charMapImg: HTMLImageElement, char: string) => {
    if (!char) {
        // no-op
        return;
    }

    if (char.length > 1) {
        throw new Error("You can only render one character at a given time");
    }

    const ctx = canvas.getContext('2d');
    // Determine the letter position
    const letterIndex = letters.indexOf(char);
    const posX = letterWidth * letterIndex;
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

const useCanvasTouchListener = (canvas: HTMLCanvasElement) => {
    const onTouchStart = useCallback((ev: TouchEvent) => {
        const position = getTouchPosition(canvas, ev);
        const event = new MouseEvent('mousedown', {
            clientX: position.x,
            clientY: position.y,
        });
        canvas.dispatchEvent(event);
    }, [canvas]);

    const onTouchMove = useCallback((ev: TouchEvent) => {
        const position = getTouchPosition(canvas, ev);
        const event = new MouseEvent('mousemove', {
            clientX: position.x,
            clientY: position.y,
        });
        canvas.dispatchEvent(event);
    }, [canvas]);

    const onTouchEnd = useCallback(() => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    }, [canvas]);

    const onMouseDown = useCallback((ev: MouseEvent) => {
        renderState.lastPos = getMousePosition(canvas, ev);
        renderState.capturing = true;
    }, [canvas]);

    const onMouseUp = useCallback(() => {
        renderState.capturing = false;
    }, [canvas]);

    const onMouseMove = useCallback((ev: MouseEvent) => {
        if (!canvas) {
            return;
        }

        renderState.mousePos = getMousePosition(canvas, ev);
    }, [canvas]);


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
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';

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

interface LetterDrawElement {
    getCanvas: () => HTMLCanvasElement;
}

const LetterDraw = React.forwardRef<LetterDrawElement, LetterDrawProps>(({character, ...rest}, ref) => {
    const [canvasCleared, setCanvasCleared] = useState(false);
    const [canvas, setCanvasRef] = useCanvasSetup();
    const [image, isImageLoaded] = useImageLoad('/images/letters-stroke.png');

    // Setup touch/click listener for drawing/data storing for matching
    useCanvasTouchListener(canvas);

    useEffect(() => setCanvasCleared(true), [character]);

    // Setup target character to render in order for user to
    //  draw
    useEffect(() => {
        if (!canvas || !isImageLoaded || !canvasCleared) {
            return;
        }

        drawCharacter(canvas, image, character);
        setCanvasCleared(false);
    }, [canvas, isImageLoaded, character, image, canvasCleared]);

    const clearCanvas = useCallback(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        setCanvasCleared(true);
    }, [canvas, setCanvasCleared]);

    useImperativeHandle(ref, () => ({
        ...rest,
        getCanvas: () => canvas,
    }), [canvas]);

    return (
        <>
            <canvas
                ref={setCanvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="border-2"
            >
            </canvas>
            <button onClick={clearCanvas}>
                clear
            </button>
        </>
    );
});

export type LetterDrawHandle = React.ElementRef<typeof LetterDraw>;

export default LetterDraw;