const fetch = require('node-fetch');
const express = require('express');
const app = express();

let httpServer;

app.use((req, res, next) => {
  res.locals.doubled = parseInt(req.query.number) * 2;
  next();
});

beforeAll(async () => {
  httpServer = await new Promise(resolve => {
    const server = app.listen(() => {
      console.log('listening on', server.address().port);
      resolve(server);
    })
  });
});

afterAll(async () => {
  await new Promise(resolve => httpServer.close(resolve));
});

test('fails', async () => {
  // 1. Set up a middleware with assertion that fails
  let actualValue;

  app.use((req, res, next) => {
    actualValue = res.locals.doubled;
    next();
  });

  // 2. Make a request to the server
  await fetch(`http://localhost:${httpServer.address().port}?number=2`);

  expect(actualValue).toBe(3);
});

