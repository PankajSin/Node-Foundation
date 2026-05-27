// console.log('NODE_ENV:', process.env.NODE_ENV);  //initially undefined

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'local';

console.log(`[Bubble Launched] Mode: ${MODE} | Port: ${PORT}`);
