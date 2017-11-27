import { otsu } from '../lib/otsu';
import * as numjs from '../lib/numjs';

export class ImageUtils {

    static toGrayScale(image: ImageData): ImageData {
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

    static calcHistogram(image: ImageData): Array<number> {
        let hist: Array<number> = new Array(255);
        for (let idx = 0; idx < image.width * image.height; idx++) {
            hist[image.data[idx]]++;
        }
        return hist;
    }

    static binarize(image: ImageData): ImageData {
        let hist = otsu.histogram(image);
        let threshold = otsu.otsu(hist, 2)[0];
        let binarizedImageData = image.data.map((pixel: number) => {
            return pixel > threshold ? 255 : 0;
        });
        return new ImageData(binarizedImageData, image.width, image.height);
    }

    static resize(image: ImageData, newWidth: number, newHeight: number): ImageData {
        let tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = image.width > newWidth ? image.width : newWidth;
        tmpCanvas.height = image.height > newHeight ? image.height : newHeight;
        let context = tmpCanvas.getContext('2d');
        context.putImageData(image, 0, 0);
        context.drawImage(tmpCanvas, 0, 0, newWidth, newHeight);
        return context.getImageData(0, 0, newWidth, newHeight);
    }

    // static convolve(img: Img, kernel: Img): Img {
    //     let kernelWidth = kernel.length;
    //     let kernelHeight = kernel[0].length;
    //     let imgWidth = img.length;
    //     let imgHeight = img[0].length;
    //     let result = new Array<Float32Array>();
    //     for (let i = 0; i < imgWidth; i++) {
    //         result.push(new Float32Array(imgHeight));
    //     }
        

    //     return result;
    // }

    static imgToMatrix(img: ImageData): any {
        let m = numjs.array(Array.from(img.data));
        let channels: number = img.data.length / (img.width * img.height);
        return m.reshape(img.width, img.height, channels);
    }

    static matrixToImg(m): ImageData {
        let shape = m.shape
        let flattened = m.flatten();
        let img = new ImageData(new Uint8ClampedArray(flattened.tolist()), shape[0], shape[1]);
        return img;
    }

    static drawRect(imgArr, x1, y1, x2, y2, color) {
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

    static drawPoints(imgArr, points, color) {
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
}