const { receive } = require('./vm');

receive('1', "(a) => console.log(a / 2)");
receive('2', "(a) => console.log(a / 3)");
receive('2', "(a) => console.log(a / 4)");

console.log('now check receives.json');