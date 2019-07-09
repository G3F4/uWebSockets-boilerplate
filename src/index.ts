import { readFileSync } from 'fs';
import { App } from 'uWebSockets.js';
import { StaticFileExtension } from './types';

const PORT = parseInt(process.env.PORT, 10) || 3001;

const server = App();

server.ws('/*', {
  compression: 0,
  maxPayloadLength: 16 * 1024 * 1024,
  // idleTimeout: 10,
  open: (ws, req) => {
    console.log(['server.ws.drain'], ws, req);
    ws.send(JSON.stringify({
      data: 'Connection established',
      type: 'SERVER_INIT'
    }));
    setInterval(() => {
      ws.send(JSON.stringify({
        data: Date.now(),
        type: 'SERVER_TIME'
      }));
    }, 1000);
  },
  message: (ws, message, isBinary) => {
    console.log(['server.ws.message'], message, isBinary);
  },
  drain: (ws) => {
    console.log(['server.ws.drain'], ws.getBufferedAmount());
  },
  close: (ws, code, message) => {
    console.log(['server.ws.drain'], ws, code, message);
  }

});

server.get('/', (res, req) => {
  // set Content-Type header
  res.writeHeader('Content-Type', 'text/html');

  // read index.html into text string
  const indexPage = readFileSync(`${process.cwd()}/public/index.html`, 'utf8');

  // end response - send
  res.end(indexPage);

});

server.any('/*', (res, req) => {
  process.stdout.write(`${req.getUrl()}\n`);

  try {
    // read url
    const url = req.getUrl();

    // split url by dot to extract file extension
    const urlParts = url.split('.');
    const fileExtension = urlParts[urlParts.length - 1] as StaticFileExtension;

    // set Content-Type header based on file extension
    switch (fileExtension) {
      case 'css': {
        res.writeHeader('Content-Type', 'text/css');
        break;
      }
      case 'js': {
        res.writeHeader('Content-Type', 'text/javascript');
        break;
      }
      case 'ico': {
        res.writeHeader('Content-Type', 'image/x-icon');
        break;
      }
    }

    // read file
    const file = readFileSync(`${process.cwd()}/public${req.getUrl()}`, 'utf8');

    // end response - send
    res.end(file);
  }

  catch (e) {
    res.end(e.toString());
  }
});

// start server by setting PORT to listening
server.listen(PORT, listenSocket => {
  // if callback function argument is defined, then server is up and running
  if (listenSocket) {
    process.stdout.write('\x1b[33m');
    process.stdout.write(`Listening to port ${PORT}\n`);
    process.stdout.write('\x1b[0m');
  }
});
