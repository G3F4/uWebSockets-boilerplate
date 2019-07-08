document.addEventListener('DOMContentLoaded', () => {
  const node = document.createElement('h1');
  const textNode = document.createTextNode('uWebSockets.js boilerplate!');

  node.setAttribute("class", "header");
  node.appendChild(textNode);
  document.getElementById('root').appendChild(node);

  const ws = new WebSocket('ws://localhost:3001');
  console.log(['Socket'], ws);
  ws.onopen = event => {
    console.log(['Socket.onopen'], event);
    ws.send("Here's some text that the server is urgently awaiting!");
  };
});
