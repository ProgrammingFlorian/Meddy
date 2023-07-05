export const generatePinFromUUID = (uuid: string): string => {
    // Remove any hyphens from the UUID
    const uuidWithoutHyphens = uuid.replace(/-/g, '');

    // Take the first 6 characters of the UUID
    const pinSubstring = uuidWithoutHyphens.substring(0, 6);

    // Convert the hexadecimal substring to a decimal number
    const pinDecimal = parseInt(pinSubstring, 16);

    // Take the last 6 digits of the decimal number and pad with zeros if necessary
    return String(pinDecimal % 1000000).padStart(6, '0');
}