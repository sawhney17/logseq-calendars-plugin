'use strict';

const WebSocket = require('ws');

const sendMessage = async function (socket, { type, procedureId, payload, statusCode = 200 }) {
  if (!socket) {
    throw new Error('Socket is missing.');
  }
  if (!type) {
    throw new Error('Type is missing.');
  }

  const message = { type, payload, statusCode };

  if (procedureId) {
    message.procedureId = procedureId;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  await new Promise((resolve, reject) => {
    socket.send(JSON.stringify(message), err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

module.exports = sendMessage;
