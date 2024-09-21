const axios = {
  get: jest.fn(() => Promise.resolve({ data: { username: "mock" } })),
};
// 直接模拟modules
module.exports = axios;
