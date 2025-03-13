import { Link, useViewTransitionState } from "@remix-run/react";

export default function NavImage({ src, alt, to, id }: any): any {
  const vt = useViewTransitionState(to);
  return (
    <Link to={to} prefetch="intent" viewTransition>
      <img
        src={src}
        alt={alt}
        style={{
          viewTransitionName: vt ? `image-expand-${id}` : `animation-${id}`,
        }}
      />

      <div>NEW</div>
      <div style={{ viewTransitionName: `text-expand-${id}` }}>
        Ryuho shoes v{id}
      </div>
      <div>
        <div>Women's shoes</div>
        <div>1 color</div>
        <div>¥13,530</div>
        <div>(including TAX)</div>
      </div>
    </Link>
  );
}
