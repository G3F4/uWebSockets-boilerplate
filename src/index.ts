import { App } from 'uWebSockets.js';
import { readFileSync } from 'fs';
import { StaticFileExtension } from './types';

const PORT = parseInt(process.env.PORT, 10) || 3001;

const server = App();

// testing endpoint
// example: http://localhost:3001/test/testParametruPierwszego/test/testParametruDrugiego/?parampierwszy=test1&paramdrugi=test2
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
  const indexPage = readFileSync(`${__dirname}/public/index.html`, 'utf8');

  // end response - send
  res.end(indexPage);

});

server.get('/*', (res, req) => {
  // read url
  const url = req.getUrl();

  // read file
  const file = readFileSync(`${__dirname}/public${req.getUrl()}`, 'utf8');

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
  }

  // end response - send
  res.end(file);
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
