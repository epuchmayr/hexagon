const { createMachine, createActor, assign } = require('xstate')


const lightBulbMachine = createMachine({
  id: 'lightBulb',
  initial: 'unlit',
  states: {
    lit: {
      on: {
        BREAK: 'broken',
        TOGGLE: 'unlit'
      }
    },
    unlit: {
      on: {
        BREAK: 'broken',
        TOGGLE: 'lit'
      }
    },
    broken: {}
  }
})

const lightBulbActor = createActor(lightBulbMachine).start();

console.log(lightBulbMachine.initialState)
console.log(lightBulbMachine('unlit', 'TOGGLE'))
console.log(lightBulbMachine('unlit', 'BREAK'))
console.log(lightBulbMachine('broken', 'TOGGLE'))