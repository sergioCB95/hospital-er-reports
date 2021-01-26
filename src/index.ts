import system from './system';

(async () => {
  await system().start();
})()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
