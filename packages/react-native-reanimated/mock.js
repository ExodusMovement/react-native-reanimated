const Reanimated = require('./lib/module/mock');
// @ts-expect-error
const Animated = Reanimated.default;

module.exports = {
  ...Reanimated,

  default: {
    ...Animated,
  },
};
