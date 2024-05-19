import React, { useRef, useEffect, useState } from 'react';
import './index.css';

const AdCustomizer = () => {
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('Hello World!');
    const [cta, setCta] = useState('Contact Us');
    const [bgColor, setBgColor] = useState('#F20C0C');
    const [colorHistory, setColorHistory] = useState(['#F20C0C', '#FFFFFF', '#1F2937', '#97FF00', '#D1D5DB']);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image
        if (image) {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = () => {
                ctx.drawImage(img, 56, 56, 970, 600);
            };
        }

        // Draw caption
        ctx.font = '44px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        wrapText(ctx, caption, 50, 700, 1000, 44);

        // Draw CTA
        ctx.font = '30px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(50, 780, ctx.measureText(cta).width + 40, 50);
        ctx.fillStyle = '#000000';
        ctx.fillText(cta, 70, 815);
    }, [image, caption, cta, bgColor]);

    const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');// Split the text into individual words
        let line = '';//// Initialize an empty string to store lines of text

        //// Loop through each word in the text
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';//// Add the next word to the line
            const metrics = ctx.measureText(testLine);// Measure the width of the line of text
            const testWidth = metrics.width;//// Get the width of the line

            //// If the width of the line exceeds the maximum width and it's not the first word
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);// Draw the line of text on the canvas
                line = words[n] + ' ';// Start a new line with the current word
                y += lineHeight;// Move to the next line (lineHeight is the spacing between lines)
            } else {
                line = testLine;// Continue adding words to the current line
            }
        }
        ctx.fillText(line, x, y);// Draw the last line of text
    };

    //handle the event when a user uploads an image file
    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleColorChange = (color) => {
        setBgColor(color);// Sets the background color to the selected color
        setColorHistory((prevColors) => {
            // Constructs a new array with the selected color as the first element
            const newColors = [color, ...prevColors.filter((c) => c !== color)];
            // Limits the array to the last 5 unique colors
            return newColors.slice(0, 5);
        });
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:space-x-8 p-8 bg-gray-100 min-h-screen">
            <div className="flex flex-col space-y-4 w-full md:w-1/3">
                <h2 class="text-center text-green-500">
                    Ad Customization
                </h2><br />
                <p>Customise your ad and get the templates accordingly</p>

                <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-lg">Change the ad creative image</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-lg">Ad Content</label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Edit caption"
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows="4"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-lg">CTA</label>
                    <input
                        type="text"
                        value={cta}
                        onChange={(e) => setCta(e.target.value)}
                        placeholder="Edit CTA"
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-lg">Choose your color</label>
                    <div className="flex flex-wrap space-x-2">
                        {colorHistory.map((color, index) => (
                            <button
                                key={index}
                                className={`w-8 h-8 rounded-full ${bgColor === color ? 'ring-2 ring-blue-600' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                            />
                        ))}
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-8 h-8 rounded-full cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center w-full md:w-2/3">
                <canvas ref={canvasRef} width="1080" height="1080" className="w-full h-full border-2 border-gray-300" />
            </div>
        </div>
    );
};

export default AdCustomizer;
