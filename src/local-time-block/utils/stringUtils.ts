export function zoneClean(zone: string): string {
    return zone.replace("/", " | ").replaceAll("_", " ")
}