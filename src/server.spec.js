const http = require('http');

jest.mock('http');
http.createServer = jest.fn(() => ({ listen: jest.fn() }));

const MockRes = require('mock-res');

process.env.CONNECT_TYPE = 'ZEPPELIN';
const connectServer = require('./server');

describe('server', () => {
  describe('status', () => {
    it('puts status onto response', () => {
      const res = new MockRes();
      connectServer.status(null, res);
      expect(res.statusCode).toEqual(200);
      expect(res.statusMessage).toEqual('OK');
      expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
      expect(res._getJSON()).toEqual({ message: 'OK' }); // eslint-disable-line no-underscore-dangle
    });
  });
});
