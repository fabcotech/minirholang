const fs = require('fs');

const sendsFile = './sends.json';
const receivesFile = './receives.json';

module.exports.receive = (channelA, continuation) => {
  if (
    typeof channelA !== 'string' &&
    typeof channelA !== 'number'
  ) {
    throw new Error('Channel must be a string or number')
  }
  let receives = {};
  try {
    receives = JSON.parse(fs.readFileSync(receivesFile, 'utf8'));
  } catch (err) {}
  if (receives[channelA]) {
    receives[channelA].push(continuation)
  } else {
    receives[channelA] = [continuation];
  }
  fs.writeFileSync(receivesFile, JSON.stringify(receives, null, 1), 'utf8');
}

module.exports.send = (channel, value) => {
  if (
    typeof channel !== 'string' &&
    typeof channel !== 'number'
  ) {
    throw new Error('Channel must be a string or number')
  }
  let sends = {};
  try {
    sends = JSON.parse(fs.readFileSync(sendsFile, 'utf8'));
  } catch (err) {}

  if (sends[channel]) {
    sends[channel].push(value)
  } else {
    sends[channel] = [value];
  }
  fs.writeFileSync(sendsFile, JSON.stringify(sends, null, 1), 'utf8');
}

module.exports.execute = () => {
  let sends = {};
  try {
    sends = JSON.parse(fs.readFileSync(sendsFile, 'utf8'));
  } catch (err) {};

  let receives = {};
  try {
    receives = JSON.parse(fs.readFileSync(receivesFile, 'utf8'));
  } catch (err) {};

  const trace = [];

  const f = () => {
    let over = true;
    Object.keys(receives).forEach(channel => {
      /*
        Find a match between a send-receive on same channel
      */
      if (
        receives[channel][0] &&
        sends[channel][0]
      ) {
        over = false;
        console.log('consuming one send/receive for channel', channel);
        const continuation = receives[channel][0]
        console.log("continuation is                       ", continuation);
        console.log("value is                              ", sends[channel][0]);
        eval(continuation)(sends[channel][0]);
        receives = {
          ...receives,
          [channel]: receives[channel].slice(1)
        }
        sends = {
          ...sends,
          [channel]: sends[channel].slice(1)
        }
        trace.push(channel);
        
      } else {

      }
    });

    if (over) {
      fs.writeFileSync(receivesFile, JSON.stringify(receives, null, 1), 'utf8');
      fs.writeFileSync(sendsFile, JSON.stringify(sends, null, 1), 'utf8');
      console.log('trace :')
      console.log(trace);
    } else {
      f();
    }
  }
  f();  

}