import { likesLabel, truncate } from "../strings";

describe("likesLabel", () => {
  test("pluralizes correctly", () => {
    expect(likesLabel(0)).toBe("0 likes");
    expect(likesLabel(1)).toBe("1 like");
    expect(likesLabel(2)).toBe("2 likes");
  });

  test("handles negatives and floats", () => {
    expect(likesLabel(-5)).toBe("0 likes"); // never negative
    expect(likesLabel(2.9)).toBe("2 likes"); // floors
  });
});

describe("truncate", () => {
  test("returns original when short enough", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  test("adds ellipsis when cut", () => {
    expect(truncate("claws and paws", 6)).toBe("claws…"); // 5 + "…"
  });

  test("max <= 0 yields empty", () => {
    expect(truncate("anything", 0)).toBe("");
  });
});
