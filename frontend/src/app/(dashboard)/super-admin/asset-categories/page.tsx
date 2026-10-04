import { PaginationIconsOnly } from "./Pagination";

const page = () => {
  const birds = [
    { id: 1, name: "Robin" },
    { id: 2, name: "Sparrow" },
    { id: 3, name: "Bluejay" },
    { id: 4, name: "Cardinal" },
    { id: 5, name: "Eagle" },
    { id: 6, name: "Hawk" },
    { id: 7, name: "Falcon" },
    { id: 8, name: "Owl" },
    { id: 9, name: "Penguin" },
    { id: 10, name: "Flamingo" },
    { id: 11, name: "Pelican" },
    { id: 12, name: "Swan" },
    { id: 13, name: "Duck" },
    { id: 14, name: "Goose" },
    { id: 15, name: "Pigeon" },
    { id: 16, name: "Dove" },
    { id: 17, name: "Crow" },
    { id: 18, name: "Raven" },
    { id: 19, name: "Woodpecker" },
    { id: 20, name: "Hummingbird" },
    { id: 21, name: "Parrot" },
    { id: 22, name: "Peacock" },
    { id: 23, name: "Ostrich" },
    { id: 24, name: "Emu" },
    { id: 25, name: "Kangaroo" },
    { id: 26, name: "Canary" },
    { id: 27, name: "Finch" },
    { id: 28, name: "Swallow" },
    { id: 29, name: "Magpie" },
    { id: 30, name: "Jay" },
    { id: 31, name: "Wren" },
    { id: 32, name: "Robin" },
    { id: 33, name: "Thrush" },
    { id: 34, name: "Starling" },
    { id: 35, name: "Blackbird" },
    { id: 36, name: "Nightingale" },
    { id: 37, name: "Cuckoo" },
    { id: 38, name: "Kingfisher" },
    { id: 39, name: "Heron" },
    { id: 40, name: "Crane" },
    { id: 41, name: "Stork" },
    { id: 42, name: "Ibis" },
    { id: 43, name: "Egret" },
    { id: 44, name: "Vulture" },
    { id: 45, name: "Kite" },
    { id: 46, name: "Osprey" },
    { id: 47, name: "Kestrel" },
    { id: 48, name: "Pheasant" },
    { id: 49, name: "Quail" },
    { id: 50, name: "Turkey" },
    { id: 51, name: "Chicken" },
    { id: 52, name: "Rooster" },
    { id: 53, name: "Seagull" },
    { id: 54, name: "Albatross" },
    { id: 55, name: "Cormorant" },
    { id: 56, name: "Puffin" },
    { id: 57, name: "Toucan" },
    { id: 58, name: "Macaw" },
    { id: 59, name: "Cockatoo" },
    { id: 60, name: "Budgerigar" },
    { id: 61, name: "Lovebird" },
    { id: 62, name: "Hornbill" },
    { id: 63, name: "Woodpecker" },
    { id: 64, name: "Owl" },
    { id: 65, name: "Barn Owl" },
    { id: 66, name: "Snowy Owl" },
    { id: 67, name: "Secretary Bird" },
    { id: 68, name: "Roadrunner" },
    { id: 69, name: "Wagtail" },
    { id: 70, name: "Sparrowhawk" },
  ];
  return (
    <div>
        {/* <div>
            {
                birde
            }
        </div> */}
      <div className="max-w-xl border p-5">
        <PaginationIconsOnly data={birds} />
      </div>
    </div>
  );
};

export default page;
