/* eslint-disable reanimated/use-reanimated-error */
'use strict';

const valueUnpackerCode = `
function valueUnpacker(objectToUnpack, category, remoteFunctionName) {
  'worklet';

  let workletsCache = global.__workletsCache;
  let handleCache = global.__handleCache;
  if (workletsCache === undefined) {
    // init
    workletsCache = global.__workletsCache = new Map();
    handleCache = global.__handleCache = new WeakMap();
  }
  const workletHash = objectToUnpack.__workletHash;
  if (workletHash !== undefined) {
    let workletFun = workletsCache.get(workletHash);
    if (workletFun === undefined) {
      const initData = objectToUnpack.__initData;
      if (initData.location && initData.sourceMap) {
        workletFun = global.evalFromHashValue(workletHash, initData.location, initData.sourceMap);
      }else {
        workletFun = global.evalFromHashValue(workletHash);
      }
      workletsCache.set(workletHash, workletFun);
    }
    const functionInstance = workletFun.bind(objectToUnpack);
    objectToUnpack._recur = functionInstance;
    return functionInstance;
  } else if (objectToUnpack.__init !== undefined) {
    let value = handleCache.get(objectToUnpack);
    if (value === undefined) {
      value = objectToUnpack.__init();
      handleCache.set(objectToUnpack, value);
    }
    return value;
  } else if (category === 'RemoteFunction') {
    const fun = () => {
      const label = remoteFunctionName ? "function " + remoteFunctionName : "anonymous function";
      throw new Error("[Reanimated] Tried to synchronously call a non-worklet" + label + " on the UI thread. See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#tried-to-synchronously-call-a-non-worklet-function-on-the-ui-thread for more details.");
    };
    fun.__remoteFunction = objectToUnpack;
    return fun;
  } else {
    throw new Error("[Reanimated] Data type in category " + category + " not recognized by value unpacker: " + _toString(objectToUnpack) + ".");
  }
}`;

export function getValueUnpackerCode() {
  return valueUnpackerCode;
}
