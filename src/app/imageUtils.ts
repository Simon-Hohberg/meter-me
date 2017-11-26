import { otsu } from '../lib/otsu';
import { Img } from './img';
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
}