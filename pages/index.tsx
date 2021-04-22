import LetterDraw, {LetterDrawHandle} from "../components/LetterDraw";
import {useCallback, useRef, useState} from "react";
import pixelmatch from 'pixelmatch';


export default function Home() {
    const [char, setChar] = useState(null);
    const localCanvas = useRef<HTMLCanvasElement>(null);
    const letterDraw = useRef<LetterDrawHandle>(null);

    const showImageData = useCallback(() => {
        if (!letterDraw.current) {
            return;
        }

        const canvas = letterDraw.current.getCanvas();
        const canvasLocal = localCanvas.current;
        const localCtx = localCanvas.current.getContext('2d');
        const ctx = canvas.getContext('2d');

        const img1 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const img2 = localCtx.getImageData(0, 0, canvasLocal.width, canvasLocal.height).data;

        const result = pixelmatch(
            img1,
            img2,
            null,
            canvas.width,
            canvas.height,
        )

        console.log(result);

        localCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    }, [letterDraw, localCanvas]);

    return (
        <div>
            <LetterDraw ref={letterDraw} character={char}/>
            <input type="text" maxLength={1} onChange={e => setChar(e.target.value)}/>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={showImageData}
            >
                Button
            </button>
            <canvas
                ref={localCanvas}
                width={320}
                height={576}
            />
        </div>
    );
}
