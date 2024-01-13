const { createMachine, createActor, assign } = require('xstate')


const textMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgCcx0ICoBiAFzAA96TJd6BtABgF1FQABwD2sDrmH4BIJogBMAVm4kAjAHYVATjXdNAFgAcK3ZoA0IAJ6IAtHoDMJOWoV2VC9frsa9AXx-m0LDxCUnZ6GgZmVhx0fBgefiQQETFwyWlZBGs7BRIjADYDfL187ns7EudzKwQDPRIKu24DORyFQwNuOT8AjBwCYjZqcLjIlhJMYVRUDgTpFPF0pMzW-JJNOpLNQs1t7jLqxAq1ru5jOwMlOXy1PQUekED+kKHxUcZxzFjMMAAbOaSCzSUmW8jkBnWFT0ek0chUdmKmgUakOCGMalU7j0ai83CUjU0fn8IHwwggcGkT2CxHmokWINAmWsBgcBSKJTKdmOBlR1nhyjUzlcdlhgpF+QeVIGpAoVBotNSEgZMkQejkchI3BFanycO03EFPMsiDc9TU1wU+RUN2MCgUG0lfWpoWG8sBdOBGUQak0mvUcmxZSRBk8qOu9Tu2PsKhaOM6aiJPiAA */
  context: {
    committedValue: '',
    value: '',
  },
  initial: 'reading',
  states: {
    reading: {
      on: {
        'text.edit': { target: 'editing' },
      },
    },
    editing: {
      on: {
        'text.change': {
          actions: assign({
            value: ({ event }) => event.value,
          }),
        },
        'text.commit': {
          actions: assign({
            committedValue: ({ context }) => context.value,
          }),
          target: 'reading',
        },
        'text.cancel': {
          actions: assign({
            value: ({ context }) => context.committedValue,
          }),
          target: 'reading',
        },
      },
    },
  },
});

const textActor = createActor(textMachine).start();

textActor.subscribe((state) => {
  console.log(state.context.value);
});

textActor.send({ type: 'text.edit' });
// logs ''
textActor.send({ type: 'text.change', value: 'Hello' });
// logs 'Hello'
textActor.send({ type: 'text.commit' });
// logs 'Hello'
textActor.send({ type: 'text.edit' });
// logs 'Hello'
textActor.send({ type: 'text.change', value: 'Hello world' });
// logs 'Hello world'
textActor.send({ type: 'text.cancel' });
// logs 'Hello'