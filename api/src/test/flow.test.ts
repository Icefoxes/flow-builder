const sum = (a: number, b: number) => a + b;

it("test if flow can be added", () => {
  expect(sum(1, 2)).toBe(3);
});
