const { send } = require('./vm');

send('1', 3);
send('2', 6);
send('2', 8);
send('2', 12);
send('bank', { from: 'bob', to: 'alice', amount: 3000000 });
send('bank', { from: 'bob', to: 'charlie', amount: 20000 });

console.log('now check sends.json');