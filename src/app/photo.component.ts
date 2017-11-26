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
    <canvas #inputCanvas></canvas>
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
    @ViewChild('inputCanvas') inputCanvas;
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

                self.inputCanvas.nativeElement.width = self.img.nativeElement.width;
                self.inputCanvas.nativeElement.height = self.img.nativeElement.height;
                self.context = self.inputCanvas.nativeElement.getContext('2d');
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
        let imgMat = numjs.images.read(this.inputCanvas.nativeElement);
        let greyMat = numjs.images.rgb2gray(imgMat);
        let scharr = numjs.images.scharr(greyMat);
        numjs.images.save(scharr, this.inputCanvas.nativeElement);
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