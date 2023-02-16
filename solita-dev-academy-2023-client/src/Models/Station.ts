export default interface Station {
    Id: string;
    Name_fi: string;
    Name_se: string;
    Address_fi: string;
    Address_se: string;
    Operator: string;
    Capacity?: number;
    X?: number;
    Y?: number;
}