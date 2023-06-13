export interface dUser {
    id: string,
    name?: string,
    email?: string,
    username?: string,
    password?: string,
    iat?: number,
    exp?: number
}

export interface Coordinates {
    long: number,
    lat: number
}

export function isUserObject(value: any): value is dUser {
    return typeof value === 'object' && value !== null && !Buffer.isBuffer(value);
}
  