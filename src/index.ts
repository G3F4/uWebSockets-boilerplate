import { readFileSync } from 'fs';
import { App } from 'uWebSockets.js';
import { StaticFileExtension } from './types';

const PORT = parseInt(process.env.PORT, 10) || 3001;

const server = App();

server.ws('/*', {
  open: (ws, req) => {
    console.log('A WebSocket connected via URL: ' + req.getUrl() + '!');
  },
  message: (ws, message, isBinary) => {
    const ok = ws.send(message, isBinary);
  },
  drain: (ws) => {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
  },
  close: (ws, code, message) => {
    console.log('WebSocket closed');
  }

});

// testing endpoint
// example:
// http://localhost:3001/test/testParametruPierwszego/test/testParametruDrugiego/?parampierwszy=test1&paramdrugi=test2
server.get('/test/:firstParam/test/:secondParam', (res, req) => {
  // print User-Agent header
  process.stdout.write(req.getHeader('user-agent'));
  process.stdout.write(`${req.getMethod()}\n`);
  process.stdout.write(`${req.getQuery()}\n`);
  process.stdout.write(`${req.getUrl()}\n`);
  process.stdout.write(`${req.getParameter(0)}\n`);
  process.stdout.write(`${req.getParameter(1)}\n`);

  // set Content-Type header
  res.writeHeader('Content-Type', 'text/html');

  // write simple html doc
  res.write('<html>');
  res.write('<body>');
  res.write('<div>');
  res.write('hello from uWebSockets.js!');
  res.write('</div>');
  res.write('</body>');
  res.write('</html>');

  // end response - send
  res.end();

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
