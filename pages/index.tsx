import {useEffect, useRef} from "react";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        const img = new Image();
        img.src = '/images/letters-stroke.png';
        img.addEventListener('load', () => {
            ctx.drawImage(img, 0, 0, 160, 288, 0, 0, canvas.width, canvas.height);
        });
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width="160"
                height="288"
            />
        </div>
    );
}
