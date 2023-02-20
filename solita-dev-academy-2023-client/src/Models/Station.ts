export default interface Station {
    Id: string;
    Name_fi: string;
    Name_se: string;
    Name_en: string;
    Address_fi: string;
    Address_se: string;
    Operator: string;
    Capacity: number | null;
    X?: number;
    Y?: number;
}