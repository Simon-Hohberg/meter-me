export class Img {

    public readonly w: number;
    public readonly h: number;
    public readonly c: number;

    constructor(public imageData: ImageData) {
        this.w = imageData.width;
        this.h = imageData.height;
        this.c = imageData.data.length / (this.w * this.h);
    }

    p(x, y, v?): number {
        if (v) {
            this.imageData.data[x * this.c + y] = v;
        }
        return this.imageData.data[x * this.c + y];
    }
}