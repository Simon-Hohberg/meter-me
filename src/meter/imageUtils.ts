import { otsu } from '../lib/otsu';
import * as numjs from '../lib/numjs';

export class Pixel {

    constructor(public x: number = 0, public y: number = 0, public v: number = 0) {};
    
}

export class Rect {

    constructor(public x1: number = 0, public y1: number = 0, public x2?: number, public y2?: number, public w?: number, public h?: number) {
        if (!w && !x2) {
            throw Error("Missing width w or x2");
        }
        if (!h && !y2) {
            throw Error("Missing height h or y2");
        }
        if (!w) {
            w = x2 - x1;
        }
        if (!h) {
            w = y2 - y1;
        }
        if (!x2) {
            x2 =  x1 + w;
        }
        if (!y2) {
            y2 =  y1 + h;
        }
    };

}

export function toGrayScale(image: ImageData): ImageData {
    let grayData: Array<number> = new Array();
    for (let idx = 0; idx < image.data.length; idx += 4) {
        let avg = (image.data[idx] + image.data[idx+1] + image.data[idx+2]) / 3;
        grayData.push(avg);
        grayData.push(avg);
        grayData.push(avg);
        grayData.push(255);
    }
    return new ImageData(new Uint8ClampedArray(grayData), image.width, image.height);
}

export function calcHistogram(image: ImageData): Array<number> {
    let hist: Array<number> = new Array(255);
    for (let idx = 0; idx < image.width * image.height; idx++) {
        hist[image.data[idx]]++;
    }
    return hist;
}

export function binarizeOtsu(image: ImageData): ImageData {
    let hist = otsu.histogram(image);
    let threshold = otsu.otsu(hist, 2)[0];
    let binarizedImageData = image.data.map((pixel: number) => {
        return pixel > threshold ? 255 : 0;
    });
    return new ImageData(binarizedImageData, image.width, image.height);
}

export function binarize(imgMat, threshold=-1) {
    let binarized = numjs.zeros([imgMat.shape[0], imgMat.shape[1]]);
    if (threshold === -1) {
        let values = new Uint8Array(imgMat.selection.data).sort();
        threshold = values[Math.round(values.length / 2)];
        // threshold = imgMat.mean() * 2 / 3;
    }
    for (let x = 0; x < binarized.shape[1]; x++) {
        for (let y = 0; y < binarized.shape[0]; y++) {
            // Ignores alpha
            let v = ((imgMat.get(y, x, 0) + imgMat.get(y, x, 1) + imgMat.get(y, x, 2)) / 3) > threshold ? 255 : 0;
            binarized.set(y, x, v);
        }
    }
    return binarized;
}

export function resize(image: ImageData, newWidth: number, newHeight: number): ImageData {
    let tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = image.width > newWidth ? image.width : newWidth;
    tmpCanvas.height = image.height > newHeight ? image.height : newHeight;
    let context = tmpCanvas.getContext('2d');
    context.putImageData(image, 0, 0);
    context.drawImage(tmpCanvas, 0, 0, newWidth, newHeight);
    return context.getImageData(0, 0, newWidth, newHeight);
}

export function resizeImgMat(imgMat, newWidth: number, newHeight: number) {
    let w = imgMat.shape[1];
    let h = imgMat.shape[0];
    let origCanvas = document.createElement('canvas');
    let resizedCanvas = document.createElement('canvas');
    origCanvas.width  = w;
    origCanvas.height = h;
    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;
    // Draw image at original size
    numjs.images.save(imgMat, origCanvas);
    let resizedContext = resizedCanvas.getContext('2d');
    // Use same canvas as source and destination to draw image at new size
    resizedContext.drawImage(origCanvas, 0, 0, newWidth, newHeight);
    return numjs.images.read(resizedCanvas);
}

export function imgToMatrix(img: ImageData): any {
    let m = numjs.array(Array.from(img.data));
    let channels: number = img.data.length / (img.width * img.height);
    if (channels === 1) {
        return m.reshape(img.height, img.width);
    }
    return m.reshape(img.height, img.width, channels);
}

export function matrixToImg(m): ImageData {
    let canvas = document.createElement('canvas');
    canvas.width = m.shape[1];
    canvas.height = m.shape[0];
    numjs.images.save(m, canvas);
    let context = canvas.getContext('2d');
    return context.getImageData(0, 0, m.shape[1], m.shape[0]);
}

export function drawRect(imgArr, x1, y1, x2, y2, color) {
    let numChannels = color instanceof Array ? color.length : 1;
    let imgNumChannels = imgArr.shape.length > 2 ? imgArr.shape[2] : 1;
    if (imgNumChannels !== numChannels) {
        throw new Error("Number of color channels of image (" + imgNumChannels + ") and color (" + numChannels + ") does not match");
    }
    if (numChannels !== 1 && numChannels !== 3 && numChannels !== 4) {
        throw new Error("Unsupported number of color channels: " + numChannels + ". Only 1, 3 and 4 are supported.");
    }
    for (let x = x1; x <= x2; x++) {
        if (numChannels === 1) {
            imgArr.set(y1, x, color);
            imgArr.set(y2, x, color);
        } else {
            imgArr.set(y1, x, 0, color[0]);
            imgArr.set(y1, x, 1, color[1]);
            imgArr.set(y1, x, 2, color[2]);
            imgArr.set(y2, x, 0, color[0]);
            imgArr.set(y2, x, 1, color[1]);
            imgArr.set(y2, x, 2, color[2]);
            if (numChannels === 3) {
                imgArr.set(y1, x, 3, 255);
                imgArr.set(y2, x, 3, 255);
            } else {
                imgArr.set(y1, x, 3, color[3]);
                imgArr.set(y2, x, 3, color[3]);
            }
        }
    }
    for (let y = y1; y <= y2; y++) {
        if (numChannels === 1) {
            imgArr.set(y, x1, color);
            imgArr.set(y, x2, color);
        } else {
            imgArr.set(y, x1, 0, color[0]);
            imgArr.set(y, x1, 1, color[1]);
            imgArr.set(y, x1, 2, color[2]);
            imgArr.set(y, x2, 0, color[0]);
            imgArr.set(y, x2, 1, color[1]);
            imgArr.set(y, x2, 2, color[2]);
            if (numChannels === 3) {
                imgArr.set(y, x1, 3, 255);
                imgArr.set(y, x2, 3, 255);
            } else {
                imgArr.set(y, x1, 3, color[3]);
                imgArr.set(y, x2, 3, color[3]);
            }
        }
    }
}

export function drawPoints(imgArr, points, color) {
    let numChannels = color instanceof Array ? color.length : 1;
    let imgNumChannels = imgArr.shape.length > 2 ? imgArr.shape[2] : 1;
    if (imgNumChannels !== numChannels) {
        throw new Error("Number of color channels of image (" + imgNumChannels + ") and color (" + numChannels + ") does not match");
    }
    if (numChannels !== 1 && numChannels !== 3 && numChannels !== 4) {
        throw new Error("Unsupported number of color channels: " + numChannels + ". Only 1, 3 and 4 are supported.");
    }
    for (let p of points) {
        if (numChannels === 1) {
            imgArr.set(p.x, p.y, color);
        } else {
            imgArr.set(p.y, p.x, 0, color[0]);
            imgArr.set(p.y, p.x, 1, color[1]);
            imgArr.set(p.y, p.x, 2, color[2]);
            if (numChannels === 3) {
                imgArr.set(p.y, p.x, 3, 255);
            } else {
                imgArr.set(p.y, p.x, 3, color[3]);
            }
        }
    }
}

export function isWhite(imgArr, x, y) {
    return imgArr.get(y, x) === 255;
}

export function isOOB(imgArr, x, y) {
    return x >= imgArr.shape[1] || y >= imgArr.shape[0] || x < 0 || y < 0;
}

export function fixOOB(imgArr, x?, y?) {
    if (x !== undefined) {
        return Math.min(Math.max(0, x), imgArr.shape[1] - 1);
    }
    if (y !== undefined) {
        return Math.min(Math.max(0, y), imgArr.shape[0] - 1);
    }
    throw Error("Neither x nor y given");
}

export function isBorder(imgArr, x, y) {
    return imgArr.get(y-1, x-1) === 0 
        || imgArr.get(y-1, x) === 0 
        || imgArr.get(y-1, x+1) === 0
        || imgArr.get(y,   x+1) === 0
        || imgArr.get(y+1, x+1) === 0
        || imgArr.get(y+1, x) === 0
        || imgArr.get(y+1, x-1) === 0
        || imgArr.get(y,   x-1) === 0;
}

export function getNeighbours(imgArr, x, y) {
    return [
        new Pixel(x-1, y-1, imgArr.get(y-1, x-1)),
        new Pixel(x, y-1, imgArr.get(y-1, x)),
        new Pixel(x+1, y-1, imgArr.get(y-1, x+1)),
        new Pixel(x+1, y, imgArr.get(y, x+1)),
        new Pixel(x+1, y+1, imgArr.get(y+1, x+1)),
        new Pixel(x, y+1, imgArr.get(y+1, x)),
        new Pixel(x-1, y+1, imgArr.get(y+1, x-1))
    ].filter((p) => { return !isOOB(imgArr, p.x, p.y) });
}

// TODO: not working
export function changeType(imgArr, newType) {
    return numjs.zeros(imgArr.shape, newType).add(imgArr);
}

export function initMat(shape, value, dtype='uint8') {
    let numElems = 1;
    for (let i of shape) {
        numElems *= i;
    }
    let arr = new Array<number>(numElems);
    arr.fill(value);
    let mat = numjs.array(arr, dtype);
    mat = mat.reshape(shape);
    return mat;
}

export function normalize(imgMat) {
    let min = imgMat.min();
    let max = imgMat.max();
    if (max === 0) {
        return imgMat;
    }
    let minMat = initMat(imgMat.shape, min);
    let result = numjs.subtract(imgMat, minMat);
    let ratio = Math.floor(255. / (max - min));
    let ratioMat = initMat(imgMat.shape, ratio);
    result = numjs.multiply(result, ratioMat);
    return result; 
}

export function medianDenoise(imgMat) {
    let denoisedMat = numjs.array(imgMat);
    let w = imgMat.shape[1];
    let h = imgMat.shape[0];
    let median = (x, y) => {
        let values = getNeighbours(imgMat, x, y).map((p) => { return p.v });
        let value = imgMat.get(y, x);
        values = values.sort();
        return Math.round((values[Math.round(values.length / 2)] + value) / 2);
    };
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < w; y++) {
            denoisedMat.set(y, x, median(x, y));
        }
    }
}