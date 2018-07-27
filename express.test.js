const fetch = require('node-fetch');
const express = require('express');

class FakeServer {
  constructor() {
    this.app = express();
    this.middlewares = [];
  }

  async setup() {
    this.httpServer = await new Promise(resolve => {
      const server = this.app.listen(() => resolve(server));
    });
  }

  async teardown() {
    await new Promise(resolve => this.httpServer.close(resolve));
  }

  use(middleware, index = null) {
    if (index === null) {
      this.middlewares.push(middleware);
      return;
    }

    this.middlewares.splice(index, 0, middleware);
  }


  ready() {
    console.log('start ready');
    console.log('middlewares', this.middlewares);

    this.middlewares.forEach(middleware => this.app.use(middleware));

    console.log('adding error middleware start');
    this.app.use((err, req, res, next) => {
      console.log('caught error', err);
      fail(err);
      next(err);
    });
    console.log('adding error middleware end');

    console.log('end ready');
  }

  get port() {
    console.log('got port');
    return this.httpServer.address().port;
  }
}

let fakeServer = new FakeServer();

fakeServer.use((req, res, next) => {
  console.log('set to hello');
  res.locals.message = 'hello';
  next();
});

fakeServer.use((req, res, next) => {
  console.log('set to world');
  res.locals.message = 'world';
  next();
});

beforeAll(() => fakeServer.setup());

afterAll(() => fakeServer.teardown());

test('fails', async () => {
  fakeServer.ready();

  fakeServer.use((req, res, next) => {
    expect(res.locals.message).toBe('hello');
    next();
  }, 1);

  fakeServer.use((req, res, next) => {
    expect(res.locals.message).toBe('world');
    next();
  });

  // 2. Make a request to the server
  console.log('before fetch');
  await fetch(`http://localhost:${fakeServer.port}?number=2`);
  console.log('after fetch');
});

