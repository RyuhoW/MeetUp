import { Link } from "@remix-run/react";

export default function Sneaker3() {
  return (
    <>
      <div className="grid grid-cols-2">
        <Link
          to={"../"}
          className="justify-self-start self-start ml-2 col-span-2"
        >
          &lsaquo; Back
        </Link>
        <img
          className="justify-self-center self-center"
          src="/sneaker3.webp"
          style={{
            viewTransitionName: "image-expand",
          }}
        />
        <div className="grid justify-self-center">
          <div className="self-center text-8xl">Ryuho shoes v3</div>
          <div className="grid grid-cols-2 text-2xl">
            <div className="col-span-2">Unisex shoes</div>
            <div className="col-span-2">1 color</div>
            <div>¥17,270</div>
            <div>(including TAX)</div>
          </div>
          <button className="bg-red-300 rounded-2xl text-5xl max-h-36  w-4/5 justify-self-center">
            今すぐ購入する
          </button>
        </div>
      </div>
    </>
  );
}
