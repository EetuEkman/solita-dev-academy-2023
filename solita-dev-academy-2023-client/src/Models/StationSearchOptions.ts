export default interface StationSearchOptions {
    NameFi: string;
    NameSe: string;
    NameEn: string;
    AddressFi: string;
    AddressSe: string;
    Operator: string;
    CapacityTo: number | null;
    CapacityFrom: number | null;
}