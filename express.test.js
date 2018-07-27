const fetch = require('node-fetch');
const express = require('express');
const app = express();

app.use((req, res, next) => {
  throw new Error('hi');
});

app.get((req, res) => {
  res.send('Success');
});

beforeAll(async () => {
  await new Promise(resolve => app.listen(1234, resolve));
});

test('fails', () => {
  const res = await fetch('http://localhost:1234/');
  const text = await res.text();

  expect(text.toBe('Success'));
});

