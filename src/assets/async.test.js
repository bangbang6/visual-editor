const fetchUser = (cb) => {
  setTimeout(() => {
    cb("hello");
  }, 100);
};

it("test call", (done) => {
  fetchUser((data) => {
    expect(data).toBe("hello");
    done(); //执行到这个done才能结束
  });
});

const userPromise = () => Promise.resolve("hello");
it("test promsie", () => {
  return userPromise().then((res) => {
    expect(res).toBe("hello");
  });
});

it("test async", async () => {
  const data = await userPromise();
  expect(data).toBe("hello");
});
