import { filterByTeam, formatMDY, PostLite, sortByLikesThenDate, Team } from "../utils";

const sample: PostLite[] = [
  { id: "1", team: "DOGS", likes: 2, createdAt: "2025-11-01T10:00:00Z" },
  { id: "2", team: "CATS", likes: 5, createdAt: "2025-11-02T10:00:00Z" },
  { id: "3", team: "DOGS", likes: 5, createdAt: "2025-11-03T10:00:00Z" },
];

test("filterByTeam returns all when team not provided", () => {
  const out = filterByTeam(sample, null as unknown as Team);
  expect(out).toHaveLength(3);
});

test("filterByTeam filters by DOGS", () => {
  const out = filterByTeam(sample, "DOGS");
  expect(out.map(p => p.id)).toEqual(["1", "3"]);
});

test("sortByLikesThenDate sorts by likes desc then newer date", () => {
  const out = sortByLikesThenDate(sample);
  // post 3 and 2 both have 5 likes; 3 is newer, so it comes first
  expect(out.map(p => p.id)).toEqual(["3", "2", "1"]);
});

test("formatMDY returns M/D/YYYY", () => {
  expect(formatMDY("2025-11-04T00:00:00Z")).toBe("11/4/2025");
});
