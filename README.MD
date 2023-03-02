## Mini RChain

The most minimalistic implementation of a Pi-Calcul / Rho-Calcul virtual machine, capable of executing code. Mainly use for illustration or education purposes, written in NodeJS, 0 dependency.

### Why ?

RChain is the coolest blockchain project that ever existed, it aimed at allowing two blocks to be proposed concurrently, and therefore allow blocks to be organized in a DAG structure. Network does not have to reach consensus on a unique queue anymore. Note that it is different than concurrent execution, it is concurrent execution + concurrent block proposal in a leaderless network.

The point of having a channel based approach is to be able to draw a graph of interaction (comm events) for a given block. And strictly / mathematically sort out if two computations (a bunch of comm events) deal with the same resources, or are strictly independent.

### What can this VM do ?

You can send values on a channel, like strings, numbers or more complex objects (please only use stuff that can be JSON serialized). Take a look at `deploy1.js` for example.

You can receive values on a channel, and provide a continuation that will be evaluated. Take a look at `deploy2.js` for example.

All the sends are stored in `sends.json` file, and receives are stored in `receives.json` file. 

**Executing**

The execute command finds match between send and receives, and execute the continuation with the value stored on the channel.

It does it in a loop fashion until there is nothing left to consume, which means that there only are sends without receives, or receives without sends.

The execute command also outputs a trace, which can be a first step to forming a block and proposing to a network.

```sh
node deploy1.js
node deploy2.js
node execute.js
```

An example of console output for an execution :

```
node execute.js
> consuming one send/receive for channel 2
> continuation is                        (a) => console.log(a / 4)
> value is                               6
> 1.5
> trace :
> [ '2' ]
```

### Challenges

#### Challenge 1

Using eval() is of course very insecure, it must be protected with a try catch.

#### Challenge 2

A continuation should of course be capable of calling send() or receive() again. it must be recursive, I guess that's where we need rholang, AST etc. [BNFC](https://hackage.haskell.org/package/BNFC) is probably the way to go.

#### Challenge 3

Based on trace, we can determine if two executions have an overlap or no overlap. in the case an overlap is found, we need to reject if two blocks are not strictly ordered one vis-à-vis another.