import { Link } from "@remix-run/react";
import NavImage from "./component/NavImage";

export default function Index() {
  return (
    <>
      <div className="justify-self-center text-6xl">SNEAKERS</div>
      <div className="justify-self-center text-2xl">X:@Ryuho8008</div>
      <div className="grid grid-cols-3">
        <div className="col-span-1 p-10">
          <Link to={"sneaker1"}>
            <img src="/sneaker1.webp" />
          </Link>
          <div>NEW</div>
          <div>Ryuho shoes v1</div>
          <div>Women's shoes</div>
          <div>1 color</div>
          <div>¥21,230</div>
          <div>(including TAX)</div>
        </div>

        <div className="col-span-1 p-10">
          <Link to={"Sneaker2"} viewTransition>
            <img src="/sneaker2.webp" />
          </Link>
          <div>NEW</div>
          <div>Ryuho shoes v2</div>
          <div>Men's shoes</div>
          <div>1 color</div>
          <div>¥23,980</div>
          <div>(including TAX)</div>
        </div>

        <div className="col-span-1 p-10">
          <Link to={"sneaker3"} viewTransition>
            <img
              src="/sneaker3.webp"
              style={{
                viewTransitionName: "image-expand",
              }}
            />
          </Link>
          <div>NEW</div>
          <div>Ryuho shoes v3</div>
          <div>Unisex shoes</div>
          <div>1 color</div>
          <div>¥17,270</div>
          <div>(including TAX)</div>
        </div>

        <div className="col-span-1 p-10">
          <NavImage to="sneaker4" alt="" src="/sneaker4.webp" id="4" />
        </div>

        <div className="col-span-1 p-10">
          <NavImage to="sneaker5" alt="" src="/sneaker5.webp" id="5" />
        </div>

        <div className="col-span-1 p-10">
          <NavImage to="sneaker6" alt="" src="/sneaker6.webp" id="6" />
        </div>
      </div>
    </>
  );
}
