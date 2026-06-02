const binaryNum = 0b1010; // Decimal value: 10
const octalNum = 0o12; // Decimal value: 10
const hexNum = 0xa;

const myNumber = 255;

console.log(myNumber.toString(2)); // "11111111" (Binary)
console.log(myNumber.toString(8)); // "377"      (Octal)
console.log(myNumber.toString(16)); // "ff"       (Hexadecimal)

console.log(parseInt('11111111', 2)); // 255
console.log(parseInt('377', 8)); // 255
console.log(parseInt('ff', 16)); // 255
