import { Link } from "@remix-run/react";

export default function Sneaker5() {
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
          src="/sneaker5.webp"
          style={{
            viewTransitionName: "image-expand-5",
          }}
        />
        <div className="grid justify-self-center">
          <div
            className="self-center text-8xl"
            style={{
              viewTransitionName: "text-expand-5",
            }}
          >
            Ryuho shoes v5
          </div>
          <div className="grid grid-cols-2 text-2xl">
            <div className="col-span-2">Women's shoes</div>
            <div className="col-span-2">1 color</div>
            <div>¥13,530</div>
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
