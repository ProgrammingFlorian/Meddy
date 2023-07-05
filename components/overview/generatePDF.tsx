import { PDFDocument, StandardFonts, rgb, PDFFont, PDFImage } from 'pdf-lib';

const generatePDF = async (params: { praxisName: string, text1: string, text2: string, imagePath: string }) => {
    const { praxisName, text1, text2, imagePath } = params;

    // Create a new PDFDocument
    const doc = await PDFDocument.create();

    // Embed the Times Roman font
    const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);

    // Add a blank page to the document
    const page = doc.addPage();

    const splitTextToFit = (text: string, maxWidth: number, fontSize: number, font: PDFFont): string[] =>  {
        const words = text.split(' ');
        const lines: string[] = [];
        let line = '';

        while (words.length > 0) {
            const word = words.shift()!;
            const testLine = `${line} ${word}`;
            const testLineWidth = font.widthOfTextAtSize(testLine.trim(), fontSize);

            if (testLineWidth > maxWidth && line !== '') {
                lines.push(line.trim());
                line = word;
            } else {
                line = testLine;
            }
        }

        if (line !== '') lines.push(line.trim());

        return lines;
    }

    // Get the width and height of the page
    const { width, height } = page.getSize();
    const fontSize = 30;
    const textWidth = timesRomanFont.widthOfTextAtSize(praxisName, fontSize);

    // Load the praxis image
    const praxisImageResponse = await fetch(praxisName);
    const praxisImageArrayBuffer = await praxisImageResponse.arrayBuffer();
    const praxisImage = await doc.embedPng(new Uint8Array(praxisImageArrayBuffer));

    // Calculate the aspect ratio of the praxis image
    const praxisImageAspectRatio = praxisImage.width / praxisImage.height;

    // Calculate the new image width and height based on the desired width and aspect ratio
    const newPraxisImageWidth = 200; // Set the desired width of the praxis image
    const newPraxisImageHeight = newPraxisImageWidth / praxisImageAspectRatio;

    // Draw the praxis image centered in the page
    page.drawImage(praxisImage, {
        x: (width - newPraxisImageWidth) / 2,
        y: height - 50 - newPraxisImageHeight, // Adjust the y-coordinate as needed
        width: newPraxisImageWidth,
        height: newPraxisImageHeight
    });

    const text1FontSize = 20;
    const text1Width = timesRomanFont.widthOfTextAtSize(text1, text1FontSize);
    // Draw text1
    page.drawText(text1, {
        x: (width - text1Width) / 2,
        y: height - 180,
        size: text1FontSize,
        color: rgb(0, 0, 0)
    });

    const maxWidth = 500; // Set to the max width you want for your text
    const lines = splitTextToFit(text2, maxWidth - 100, text1FontSize, timesRomanFont);

    let y = height - 210; // Start at the same y coordinate
    const lineHeight = text1FontSize * 1.2; // Adjust as needed

    for (const line of lines) {
        const lineWidth = timesRomanFont.widthOfTextAtSize(line, text1FontSize);
        page.drawText(line, {
            x: (width - lineWidth) / 2,
            y,
            size: text1FontSize,
            color: rgb(0, 0, 0),
        });

        y -= lineHeight; // Move y coordinate down for the next line
    }

    // Fetch the main image
    const imageResponse = await fetch(imagePath);
    const imageArrayBuffer = await imageResponse.arrayBuffer();

    // Embed the image
    const pdfImage = await doc.embedPng(new Uint8Array(imageArrayBuffer));
    const maxImageWidth = width / 3;
    const maxImageHeight = height / 3;

    // Calculate the scaling factor needed to keep the image within the max dimensions while maintaining aspect ratio
    const scalingFactor = Math.min(maxImageWidth / pdfImage.width, maxImageHeight / pdfImage.height);

    // Calculate the new image dimensions
    const newImageWidth = pdfImage.width * scalingFactor;
    const newImageHeight = pdfImage.height * scalingFactor;

    // Draw the image centered in the page
    page.drawImage(pdfImage, {
        x: width / 2 - newImageWidth / 2,
        y: height / 2 - newImageHeight / 2,
        width: newImageWidth,
        height: newImageHeight
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await doc.save();

    // Convert the Uint8Array to a Blob
    const pdfBlob = new Blob([pdfBytes.buffer], { type: 'application/pdf'});

    return pdfBlob;
};

export default generatePDF;
