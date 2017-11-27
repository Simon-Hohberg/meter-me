import { Component, ViewChild } from '@angular/core';
import { ImageUtils } from './imageUtils';
import { WebCNN, Array3D } from './webcnn';
import * as numjs from '../lib/numjs';

@Component({
  selector: 'photo',
  styleUrls: ['photo.component.css'],
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
        <div class="controls">
            <button (click)="snap()">Snap</button>
        </div>
        <img #img src="assets/test/10747-220.png">
    </div>
    `
})
export class PhotoComponent {

    private static readonly CNN_FILE = 'assets/cnn_mnist_10_20_98accuracy.json';

    @ViewChild('cnnFile') cnnFile;node_modulejimp
    @ViewChild('canvas') canvas;
    @ViewChild('debug1') debug1;
    @ViewChild('debug2') debug2;
    @ViewChild('video') video;
    @ViewChild('img') img;
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
        
        fetch(PhotoComponent.CNN_FILE)
            .then(result => {
                return result.json();
            })
            .then(cnnJson => {
                self.cnn = WebCNN.loadNetworkFromJSON(cnnJson);

                self.debug1.nativeElement.width = self.img.nativeElement.width;
                self.debug1.nativeElement.height = self.img.nativeElement.height;
                self.debug2.nativeElement.width = self.img.nativeElement.width;
                self.debug2.nativeElement.height = self.img.nativeElement.height;
                self.context = self.debug1.nativeElement.getContext('2d');
                self.context.drawImage(self.img.nativeElement, 0, 0);

                let inputImage = self.context.getImageData(0, 0, self.img.nativeElement.width, self.img.nativeElement.height);
                let meterReading: Number = self.recognize(inputImage);
        
                // console.log(meterReading);
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

    recognize(inputImage: ImageData): Number {
        let imgMat = numjs.images.read(this.debug1.nativeElement);
        let greyMat = numjs.images.rgb2gray(imgMat);
        
        let binarized = numjs.zeros([greyMat.shape[0], greyMat.shape[1]]);
        for (let x = 0; x < binarized.shape[1]; x++) {
            for (let y = 0; y < binarized.shape[0]; y++) {
                // Ignores alpha
                let v = ((greyMat.get(y, x, 0) + greyMat.get(y, x, 1) + greyMat.get(y, x, 2)) / 3) > 100 ? 255 : 0;
                binarized.set(y, x, v);
            }
        }
        // let scharr = numjs.images.scharr(binarized);

        let isWhite = (imgArr, lx, ly) => {
            return imgArr.get(ly, lx) > 0;
        }
        let isOOB = (imgArr, lx, ly) => {
            return lx >= imgArr.shape[1] || ly >= imgArr.shape[0] || lx < 0 || ly < 0;
        }
        let isBorder = (imgArr, lx, ly) => {
            return imgArr.get(ly-1, lx-1) === 0 
                || imgArr.get(ly-1, lx) === 0 
                || imgArr.get(ly-1, lx+1) === 0
                || imgArr.get(ly,   lx+1) === 0
                || imgArr.get(ly+1, lx+1) === 0
                || imgArr.get(ly+1, lx) === 0
                || imgArr.get(ly+1, lx-1) === 0
                || imgArr.get(ly,   lx-1) === 0;
        }
        let seen = (lx, ly) => {
            return visited[lx + ',' + ly] === 1;
        }

        // Horizontal scan line
        let yMid = Math.round(imgMat.shape[0] / 2);
        let candidates = [];
        // Remember all visited points
        let visited = {}
        let visitedArr = [];
        for(let scanX = 0; scanX < imgMat.shape[1]; scanX++) {
            if (binarized.get(yMid, scanX) === 0) {
                continue;
            }
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
            // Follow contour
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
                    if (isWhite(binarized, n.x, n.y) && !seen(n.x, n.y) && !isOOB(binarized, n.x, n.y)) {
                        queue.push(n);
                    }
                }
            }
            candidates.push([minX, minY, maxX, maxY]);
            y = yMid;
            x = minX + 1;
            // Could enclose other objects
            while(isWhite(binarized, x, y) && !isOOB(binarized, x, y)) {
                x++;
            }
            x++;
            finished = true;
            // ImageUtils.drawPoints(imgMat, visitedArr, [255, 0, 0, 100]);
        }
        
        numjs.images.save(binarized, this.debug2.nativeElement);

        let context = this.debug2.nativeElement.getContext('2d');

        for(let c of candidates) {
            let w = c[2] - c[0];
            let h = c[3] - c[1];
            let ratio = w / h;
            // Should be portrait rather than landscape rect
            if (ratio > 1 || ratio < 1/6) {
                continue;
            }
            
            ImageUtils.drawRect(imgMat, c[0], c[1], c[2], c[3], [0, 255, 0, 255]);

            let patch = context.getImageData(c[0]-5, c[1]-5, w+10, h+10);
            patch = ImageUtils.resize(patch, 24, 24);

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
            console.log(guess);
        }



        numjs.images.save(imgMat, this.debug1.nativeElement);

        // this.context.putImageData(ImageUtils.matrixToImg(scharr), 0, 0);

        // let inputContext = CanvasRenderingContext2D = this.inputCanvas.nativeElement.getContext('2d');
        // inputContext.putImageData(inputImage, 0, 0);
        
        // Square patch (height x height)
        // let patchWidth = height;
        // let patchHeight = height;

        // for (let x = 0; x < inputImage.width; x+=5) {
        //     let patch = this.context.getImageData(x, 0, patchWidth, patchHeight);

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
        return 0;
    }
}