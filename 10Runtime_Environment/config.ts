const PORT1 = process.env.PORT || 3000;
console.log('HOME:', process.env.HOME); //undefined
console.log('PATH:', process.env.PATH);

if (process.env.NODE_ENV === 'production') {
  console.log(`App is live on port ${PORT1}`);
} else {
  console.log('it is development phase');
}
