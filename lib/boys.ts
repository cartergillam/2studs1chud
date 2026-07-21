export const boys = [
  {
    id: "carter",
    name: "Carter",
    image: "/images/carter.jpg",
    imageAlt: "Carter awaiting the Selection Authority's verdict",
    isAnimated: false,
    position: "50% 35%",
  },
  {
    id: "gabe",
    name: "Gabe",
    image: "/images/friend-one.gif",
    imageAlt: "Gabe awaiting the Selection Authority's verdict",
    isAnimated: true,
    position: "50% 35%",
  },
  {
    id: "joey",
    name: "Joey",
    image: "/images/friend-two.jpg",
    imageAlt: "Joey awaiting the Selection Authority's verdict",
    isAnimated: false,
    position: "50% 35%",
  },
] as const;

export type Boy = (typeof boys)[number];
export type BoyId = Boy["id"];
export type ChudCounts = Record<BoyId, number>;

export const boyIds = boys.map((boy) => boy.id) as BoyId[];

export const emptyChudCounts = (): ChudCounts => ({
  carter: 0,
  gabe: 0,
  joey: 0,
});
