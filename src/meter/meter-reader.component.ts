import { Component, ViewChild } from '@angular/core';
import { isWhite, isOOB, resize, binarize, drawRect, resizeImgMat, changeType, normalize, imgToMatrix, matrixToImg, medianDenoise, fixOOB, binarizeOtsu } from './imageUtils';
import { WebCNN, Array3D } from './webcnn';
import * as numjs from '../lib/numjs';

@Component({
  selector: 'meter-reader',
  styleUrls: ['meter-reader.component.css'],
  template: `
    <div class="wrapper">
        <div class="overlay">
            <div class="row semi-transparent grow"></div>
            <div class="row">
                <div class="grow semi-transparent"></div>
                <div #target class="target"></div>
                <div class="grow semi-transparent"></div>
            </div>
            <div class="row semi-transparent grow"></div>
        </div>
        <video [hidden]="true" #video autoplay></video>
        <canvas id="photoCanvas" #canvas></canvas>
        <canvas #debug1></canvas>
        <canvas #debug2></canvas>
        <canvas #debug3></canvas>
        <div class="controls">
            <button (click)="snap()">Snap</button>
        </div>
        <div #testImgs>
            <img [hidden]="true" src="assets/test/10747-220.png">
            <img [hidden]="true" src="assets/test/41674-3.png">
            <img [hidden]="true" src="assets/test/65323-3.png">
        </div>
    </div>
    `
})
export class MeterReaderComponent {

    private static readonly CNN_FILE = 'assets/cnn_mnist_10_20_98accuracy.json';

    @ViewChild('cnnFile') cnnFile;node_modulejimp
    @ViewChild('canvas') canvas;
    @ViewChild('debug1') debug1;
    @ViewChild('debug2') debug2;
    @ViewChild('debug3') debug3;
    @ViewChild('video') video;
    @ViewChild('testImgs') testImgs;
    @ViewChild('target') target;
    private context: CanvasRenderingContext2D;
    private pictureTaken: boolean = false;
    private cnn: WebCNN;

    constructor() {}

    ngAfterViewInit() {
        let self = this;
        let constraints = { audio: false, video: true };
        // let self = this;

        
        // TODO: show spinner till ready (stream and cnn)
        
        // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        //     self.video.nativeElement.srcObject = stream;
        // }, (error) => {
        //     console.error(error);
        // });recognized
        
        fetch(MeterReaderComponent.CNN_FILE)
            .then(result => {
                return result.json();
            })
            .then(cnnJson => {
                self.cnn = WebCNN.loadNetworkFromJSON(cnnJson);

                let imgs = [];

                for (let img of self.testImgs.nativeElement.children) {
                    let imgMat = numjs.images.read(img);
                    // imgMat = changeType(imgMat, 'int32');
                    imgMat = numjs.images.resize(imgMat, 82, 298);
                    imgMat = normalize(imgMat);
                    imgs.push(imgMat);
                }

                // self.debug1.nativeElement.width = self.img.nativeElement.width;
                // self.debug1.nativeElement.height = self.img.nativeElement.height;
                // self.debug2.nativeElement.width = self.img.nativeElement.width;
                // self.debug2.nativeElement.height = self.img.nativeElement.height;
                // self.context = self.debug1.nativeElement.getContext('2d');
                // self.context.drawImage(self.img.nativeElement, 0, 0);

                // let inputImage = self.context.getImageData(0, 0, self.img.nativeElement.width, self.img.nativeElement.height);
                for (let img of imgs) {
                    console.log(self.recognize(img));
                }
            });
    }

    snap() {
        // TODO: Draw current video frame to canvas
        this.video.nativeElement.pause();
        // this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
        // this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
        // this.context = this.canvas.nativeElement.getContext('2d');
        // this.context.drawImage(this.video.nativeElement, 0, 0);
        // this.canvas.nativeElement.width = this.img.nativeElement.width;
        // this.canvas.nativeElement.height = this.img.nativeElement.height;
        // let scale = this.canvas.nativeElement.width / this.canvas.nativeElement.clientWidth;
        // this.context = this.canvas.nativeElement.getContext('2d');
        // this.context.drawImage(this.img.nativeElement, 0, 0);
        // this.pictureTaken = true;
        // let targetX = Math.floor(this.target.nativeElement.offsetLeft * scale);
        // let targetY = Math.floor(this.target.nativeElement.offsetTop * scale);
        // let targetWidth = Math.floor(this.target.nativeElement.clientWidth * scale);
        // let targetHeight = Math.floor(this.target.nativeElement.clientHeight * scale);
        // this.inputCanvas.nativeElement.width = targetWidth;
        // this.inputCanvas.nativeElement.height = targetHeight;
        // let inputContext: CanvasRenderingContext2D = this.inputCanvas.nativeElement.getContext('2d');
        // let inputData = this.context.getImageData(targetX, targetY, targetWidth, targetHeight);
        
        // let patchWidth = targetHeight;
        // let patchHeight = targetHeight;

        // for (let x = 0; x < inputData.width; x+=5) {
        //     let patch = this.context.getImageData(targetX + x, targetY, patchWidth, patchHeight);

        //     patch = ImageUtils.resize(patch, 24, 24);
        //     patch = ImageUtils.toGrayScale(patch);
        //     patch = ImageUtils.binarize(patch);

        //     let result: Array<Array3D> = this.cnn.classifyImages([patch]);
        //     let guess = 0;
        //     let max = 0;
        //     for ( var i = 0; i < 10; ++i )
        //     {
        //         if ( result[ 0 ].getValue( 0, 0, i ) > max )
        //         {
        //             max = result[ 0 ].getValue( 0, 0, i );
        //             guess = i;
        //         }
        //     }
        //     console.log(guess);
        // }

        // let grayData = ImageUtils.toGrayScale(inputData);
        // let binarizedInputData = ImageUtils.binarize(grayData);
        // inputContext.putImageData(binarizedInputData, 0, 0);
    }

    recognize(imgMat): Number {
        this.debug1.nativeElement.width = imgMat.shape[1];
        this.debug1.nativeElement.height = imgMat.shape[0];
        this.debug2.nativeElement.width = imgMat.shape[1];
        this.debug2.nativeElement.height = imgMat.shape[0];
        this.debug3.nativeElement.width = imgMat.shape[1];
        this.debug3.nativeElement.height = imgMat.shape[0];

        let greyMat = numjs.images.rgb2gray(imgMat);
        numjs.images.save(greyMat, this.debug1.nativeElement);
        medianDenoise(greyMat);
        numjs.images.save(greyMat, this.debug2.nativeElement);
        
        let binarized = binarize(greyMat);
        numjs.images.save(binarized, this.debug3.nativeElement);

        let seen = (lx, ly) => {
            return visited[lx + ',' + ly] === 1;
        }

        // Segment image
        // Horizontal scan line
        let yMid = Math.round(imgMat.shape[0] / 2);
        let candidates = [];
        // Remember all visited points
        let visited = {}
        let visitedArr = [];
        for(let scanX = 0; scanX < imgMat.shape[1]; scanX++) {
            let objIsWhite = isWhite(binarized, scanX, yMid);
            let y = yMid;
            let x = scanX;
            if (seen(x, y)) {
                continue;
            }
            let minY = yMid;
            let maxY = yMid;
            let minX = scanX;
            let maxX = scanX;
            let finished = false;
            
            let queue = [{ x: x, y: y }];
            while(queue.length !== 0) {
                let p = queue.pop();
                x = p.x;
                y = p.y;
                visited[x + ',' + y] = 1;
                visitedArr.push({x: x, y: y});
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);
                let neighbours = [
                    {x: x-1, y: y-1},
                    {x: x,   y: y-1},
                    {x: x+1, y: y-1},
                    {x: x+1, y: y},
                    {x: x+1, y: y+1},
                    {x: x,   y: y+1},
                    {x: x-1, y: y+1},
                    {x: x-1, y: y}
                ];
                for (let n of neighbours) {
                    if (isWhite(binarized, n.x, n.y) == objIsWhite && !seen(n.x, n.y) && !isOOB(binarized, n.x, n.y)) {
                        queue.push(n);
                    }
                }
            }
            let w = maxX - minX;
            let h = maxY - minY;
            let ratio = w / h;
            // Should be portrait rather than landscape rect
            if (ratio > 1 || ratio < 1/6 || h < 5) {
                continue;
            } else {
                candidates.push([minX, minY, maxX, maxY]);
            }
            y = yMid;
            x = minX + 1;
            // Could enclose other objects
            while(isWhite(binarized, x, y) == objIsWhite && !isOOB(binarized, x, y)) {
                x++;
            }
            x++;
            finished = true;
            // ImageUtils.drawPoints(imgMat, visitedArr, [255, 0, 0, 100]);
        }

        let obsoleteIdxs = [];
        for (let idx1 = 0; idx1 < candidates.length; idx1++) {
            for (let idx2 = 0; idx2 < candidates.length; idx2++) {
                if (idx1 === idx2) {
                    continue;
                }
                let c1 = candidates[idx1];
                let c2 = candidates[idx2];
                // Check if c1 inside c2
                if (c1[0] > c2[0] && c1[2] < c2[2] && c1[1] > c2[1] && c1[3] < c2[3]) {
                    obsoleteIdxs.push(idx2);
                }
            }
        }

        for (let idx of obsoleteIdxs.sort().reverse()) {
            let before  = candidates.slice(0, idx);
            let after = candidates.slice(idx+1, candidates.length);
            candidates = before.concat(after);
        }

        // Take median of candidates y, width, height and distance
        let ys = [];
        let ws = [];
        let hs = [];
        let dists = [];
        let lastX = -1;
        for (let c of candidates) {
            ys.push(c[1]);
            ws.push(c[2] - c[0]);
            hs.push(c[3] - c[1]);
            if (lastX !== - 1) {
                dists.push(c[0] - lastX);
            }
            lastX = c[0];
        }
        let midIdx = Math.round(ys.length / 2);
        let medianY = ys.sort()[midIdx];
        let medianW = ws.sort()[midIdx];
        let medianH = hs.sort()[midIdx];
        let medianDist = dists.sort()[Math.round(dists.length / 2)];

        // Try recognizing each candidate using CNN
        let inputCanvas = document.createElement('canvas');
        inputCanvas.width = binarized.shape[1];
        inputCanvas.height = binarized.shape[0];
        let context = inputCanvas.getContext('2d');
        numjs.images.save(binarized, inputCanvas);
        let recognitionResult = [];
        let isDecimal = false;
        for (let c of candidates) {
            let x1 = fixOOB(imgMat, c[0] - 5);
            let y1 = fixOOB(imgMat, undefined, c[1] - 5);
            let x2 = fixOOB(imgMat, c[2] + 5);
            let y2 = fixOOB(imgMat, undefined, c[3] + 5);
            let w = x2 - x1;
            let h = y2 - y1;

            // Yet another filter for candidates too far off vertically
            if (Math.abs(y1 - medianY) > medianH * 1.5) {
                continue;
            }

            // Sanitize height and width
            if (h / medianH > 2 || h / medianH < 0.5) {
                y1 = fixOOB(imgMat, undefined, y1 - (medianH - h) / 4);
                y2 = fixOOB(imgMat, undefined, y2 + (medianH - h) / 4);
                h = y2 - y1;
            }
            if (w / medianW > 2 || w / medianW < 0.5) {
                x1 = fixOOB(imgMat, x1 - (medianW - w) / 4);
                x2 = fixOOB(imgMat, x2 + (medianW - w) / 4);
                w = x2 - x1;
            }

            // Assume h > w, make w = h
            // CNN input has to be a square
            x1 += Math.round((w - h) / 2);
            x2 -= Math.round((w - h) / 2);
            w = h;

            drawRect(imgMat, x1, y1, x2, y2, [0, 255, 0, 255]);

            let patch = context.getImageData(x1, y1, w, h);
            let patchMat = imgToMatrix(patch);
            patchMat = numjs.images.resize(patchMat, 24, 24);
            // patchMat = normalize(patchMat);
            // patchMat = binarize(patchMat);
            patch = matrixToImg(patchMat);
            this.debug2.nativeElement.width = 24;
            this.debug2.nativeElement.height = 24;
            numjs.images.save(imgToMatrix(patch), this.debug2.nativeElement);

            let result: Array<Array3D> = this.cnn.classifyImages([patch]);
            let guess = 0;
            let max = 0;
            for ( var i = 0; i < 10; ++i )
            {
                if ( result[ 0 ].getValue( 0, 0, i ) > max )
                {
                    max = result[ 0 ].getValue( 0, 0, i );
                    guess = i;
                }
            }
            
            if (!isDecimal) {
                let tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = imgMat.shape[1];
                tmpCanvas.height = imgMat.shape[0];
                let tmpCtx = tmpCanvas.getContext('2d');
                numjs.images.save(imgMat, tmpCanvas);
                let tmpMat = imgToMatrix(tmpCtx.getImageData(x1, y1-5, w, h+10));
                let numRed = 0;
                for (let x = 0; x < tmpMat.shape[1]; x++) {
                    for (let y = 0; y < tmpMat.shape[0]; y++) {
                        let redDist = Math.sqrt(Math.pow(255 - tmpMat.get(y,x,0), 2) + Math.pow(tmpMat.get(y,x,1), 2) + Math.pow(tmpMat.get(y,x,2), 2));
                        if (redDist < 100) {
                            numRed++;
                        }
                    }
                }
                if (numRed / (tmpMat.shape[0] * tmpMat.shape[1]) > 0.1) {
                    isDecimal = true;
                    recognitionResult.push('.');
                }
            }
            if (max > 0.9) {
                recognitionResult.push(guess);
            }
        }

        this.debug2.nativeElement.width = imgMat.shape[1];
        this.debug2.nativeElement.height = imgMat.shape[0];
        numjs.images.save(imgMat, this.debug2.nativeElement);
        return Number.parseFloat(recognitionResult.join(''));
    }
}