'use strict';
// import type { ShadowNodeWrapper } from '../commonTypes';
import {
  isChromeDebugger,
  isFabric,
  isJest,
  shouldBeUseWeb,
} from '../PlatformChecker';
import type {
  AnimatedRef,
  AnimatedRefOnJS,
  AnimatedRefOnUI,
} from '../hook/commonTypes';
import type { Component } from 'react';
import { logger } from '../logger';

type DispatchCommand = <T extends Component>(
  animatedRef: AnimatedRef<T>,
  commandName: string,
  args?: unknown[]
) => void;

/**
 * Lets you synchronously call a command of a native component.
 *
 * @param animatedRef - An [animated
 *   ref](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef#returns)
 *   connected to the component you'd want to call the command on.
 * @param commandName - The name of the command to dispatch (e.g. `"focus"` or
 *   `"scrollToEnd"`).
 * @param args - An optional array of arguments for the command.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/dispatchCommand
 */
export let dispatchCommand: DispatchCommand;

function dispatchCommandFabric(
  animatedRef: AnimatedRefOnJS | AnimatedRefOnUI,
  commandName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: Array<unknown> = []
) {
  /*  'worklet';
  if (!_WORKLET) {
    return;
  }

  const shadowNodeWrapper = animatedRef() as ShadowNodeWrapper;
  global._dispatchCommandFabric!(shadowNodeWrapper, commandName, args);
*/
  logger.warn(
    'dispatchCommand() is disabled: https://github.com/ExodusMovement/exodus-mobile/pull/24699. Contact AppSec if you need this.'
  );
}

function dispatchCommandPaper(
  animatedRef: AnimatedRefOnJS | AnimatedRefOnUI,
  commandName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: Array<unknown> = []
) {
  /*  'worklet';
  if (!_WORKLET) {
    return;
  }

  const viewTag = animatedRef() as number;
  global._dispatchCommandPaper!(viewTag, commandName, args);
*/
  logger.warn(
    'dispatchCommand() is disabled: https://github.com/ExodusMovement/exodus-mobile/pull/24699. Contact AppSec if you need this.'
  );
}

function dispatchCommandJest() {
  logger.warn('dispatchCommand() is not supported with Jest.');
}

function dispatchCommandChromeDebugger() {
  logger.warn('dispatchCommand() is not supported with Chrome Debugger.');
}

function dispatchCommandDefault() {
  logger.warn('dispatchCommand() is not supported on this configuration.');
}

if (!shouldBeUseWeb()) {
  // Those assertions are actually correct since on Native platforms `AnimatedRef` is
  // mapped as a different function in `shareableMappingCache` and
  // TypeScript is not able to infer that.
  if (isFabric()) {
    dispatchCommand = dispatchCommandFabric as unknown as DispatchCommand;
  } else {
    dispatchCommand = dispatchCommandPaper as unknown as DispatchCommand;
  }
} else if (isJest()) {
  dispatchCommand = dispatchCommandJest;
} else if (isChromeDebugger()) {
  dispatchCommand = dispatchCommandChromeDebugger;
} else {
  dispatchCommand = dispatchCommandDefault;
}
