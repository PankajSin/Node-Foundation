console.log('--- RUNNING NODE SCRIPT ---');
console.log('Current Environment:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
  console.log('SECURITY MODE: Hiding errors from users.');
} else {
  console.log('DEBUG MODE: Full error details visible.');
}
