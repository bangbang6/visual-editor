/* eslint-disable */
/** jest接管等时间 */
const fetchUser = (cb) => {
  setTimeout(() => {
    cb("hello");
  }, 1000);
};
jest.useFakeTimers(); /** 接管所有的时间 */

const loopFetch = (cb) => {
  setTimeout(() => {
    cb("one");
    setTimeout(() => {
      cb("two");
    }, 2000);
  }, 1000);
};

it("test the callback after 1S", () => {
  const cb = jest.fn();
  fetchUser(cb);
  expect(cb).not.toHaveBeenCalled();
  //   expect(setTimeout).toHaveBeenCalledTimes(1);
  jest.runAllTimers(); // 所有的异步时间执行完
  expect(cb).toHaveBeenCalled();
  expect(cb).toHaveBeenCalledWith("hello");
});
it("test the callback after 1S", () => {
  const cb = jest.fn();
  loopFetch(cb);
  expect(cb).not.toHaveBeenCalled();
  //   expect(setTimeout).toHaveBeenCalledTimes(1);
  jest.runOnlyPendingTimers(); // 只执行当前第一个timer
  expect(cb).toHaveBeenCalled();
  expect(cb).toHaveBeenLastCalledWith("one");
  jest.runOnlyPendingTimers(); // 只执行当前第一个timer
  expect(cb).toHaveBeenCalled();
  expect(cb).toHaveBeenLastCalledWith("two");
});
it("test the callback advanced timer", () => {
  const cb = jest.fn();
  loopFetch(cb);
  expect(cb).not.toHaveBeenCalled();
  //   expect(setTimeout).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(500); // 时间前进500ms
  jest.advanceTimersByTime(500); // 时间前进500ms
  expect(cb).toHaveBeenCalled();
  expect(cb).toHaveBeenLastCalledWith("one");
  jest.advanceTimersByTime(2000); // 时间前进500ms
  expect(cb).toHaveBeenLastCalledWith("two");
});
