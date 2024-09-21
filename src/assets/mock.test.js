import { getUsername } from "./user";
import axios from "axios";
/** jest接管axios的所有实现 */
// jest.mock("axios");
/** 重写get方法 */
// axios.get.mockImplementation(() => {
//   return Promise.resolve({ data: { username: "mengwan" } });
// });
/** 重写get方法返回 */
// axios.get.mockReturnValue(Promise.resolve({ data: { username: "mengwan" } }));
/** 重写get方法返回Promise */
axios.get.mockResolvedValue({ data: { username: "mengwan" } });
/** mock一个函数的返回值 */

const mockTest = (shouldCall, cb) => {
  if (shouldCall) {
    return cb(42);
  }
};
it("test with mock function", () => {
  const mockCb = jest.fn(); //创建对函数的监听器
  mockTest(true, mockCb); // mockcb当作cb
  expect(mockCb).toHaveBeenCalled(); //判断mockCb是否被调用过
  expect(mockCb).toHaveBeenCalledWith(42);
  console.log(mockCb.mock.calls);
  console.log(mockCb.mock.results);
});

it("test mock with imp", () => {
  const mockCb = jest.fn((x) => x * 2).mockReturnValue(20); //狸猫换太子 创建一个函数代替源代码的cb函数
  mockTest(true, mockCb); // mockcb当作cb 然后处理返回值
  console.log(mockCb.mock.results);
});

it("test mock modules", () => {
  /** 重写了axios的get方法 */
  return getUsername(1).then((name) => {
    console.log(name);
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
