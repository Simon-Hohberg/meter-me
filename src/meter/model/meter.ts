export class Meter {

    public id: string;
    public name: string;
    public type: MeterType;
    public unit: string;
    public history: Array<MeterReading>;

}

export class MeterReading {

    public value: number;
    public date: Date;

}

export enum MeterType {

    ELECTRICITY,
    WATER,
    GAS,
    GASOLINE,
    OIL

}