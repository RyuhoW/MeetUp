# useLoaderDataについて深ぼっていこう

Remixの代表的なコンポーネント、useLoaderDataについて中身を探っていきます行こう！

## 何故useLoaderData？

> [!NOTE]
> Remix is a full stack web framework that lets you focus on the user interface and `work back through web fundamentals to deliver a fast`, slick, and resilient user experience that deploys to any Node.js server and even non-Node.js environments at the edge like Cloudflare Workers.

[Official doc](https://github.com/remix-run/remix)

[!Important]これ支えているのがuseLoaderDataコンポーネント

> - 効率的なデータ取得
> - データの再利用
> - 部分的なUIレンダリング

## 自己紹介

```Typescript
  enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
  }

  interface Intro {
    Name: string;
    Position: string;
    Profile: string;
    Age: undefined;
    Gender: Gender | null;
  }

  const MySelft: Intro = {
    Name: "渡辺 龍鵬",
    Position: "エンジニア",
    Profile: "フルスタック業務、広告運用、マーケティング",
    Age: undefined,
    Gender: null
  };

  return MySelft;
```

## useLoaderDataの使い方

```Typescript {filename="loader._index.tsx"}
import { useLoaderData } from "@remix-run/react"
import hello from "../server/loader.server";

export default function Hello() {
  const remixMeetup: string = useLoaderData();
  return (
    <h1>{remixMeetup}</h1>
    //hello world
  )
}

export function loader(): string {
  const textFromServer: string = hello();
  return textFromServer;
}
```

```Typescript {filename="loader.server.ts"}
const hello = (): string => "hello world"
export default hello;
```

## useLoaderDataの実力とは

Demo

```Bash
npm run build
npm run dev
```

[PefromanceTest](http://localhost:3000/performance)

## useLoaderDataの深堀り解説

```Typescript {filename="components.d.ts"}
export declare function useLoaderData<T = AppData>(): SerializeFrom<T>;
```

> [!NOTE]NOTE
> AppDataがunknownが格納されている。

> ### Purpose
>
> SerializeFrom<T>の目的はサーバー側の型をJSONシリアライズした後
> のクライアント側の型を推論すること。
> サーバー側の型がクライアント側の型と異なる場合は特に役立つ。

> [!HINT]HINT
> Json変換によって、Data -> 文字列になる場合等

### Client or server

> 1. Client side loader -> Jsonifyを適用せずに`(SerializeClient)`、
>    Promiseで処理する`(DeferValueClient)`。
> 2. Server side loader -> Jsonifyを適用し`(Serialize)`、
>    PromiseにもJsonifyを適用する`(DeferValue)`。

### What is Jsonify

> JavaScript値をJSON互換の型に変換する役割を担っている。
>
> - Data → 文字列
> - Map / Set → 配列等
> - 関数やシンボル → 削除

> [!HINT]Why isn't Jsonify applied to the client-side loader?
>
> - Server side loader: Server -> HTTP Protocol -> Client
>
> 1. データはHTTPリクエスト/レスポンス(HTTP Protocolで
>    JavaScriptオブジェクトをそのまま転送することは不可)として転送される
> 2. JavaScriptオブジェクトが文字列化されたJSONに変換され、
>    Client側で再度パース(デシリアライズ)する。

## loaderの挙動について

[routeModules](https://github.com/remix-run/remix/blob/0e9772c8b4456c239ea148c4003932ce63a7198e/packages/remix-react/routeModules.ts#L183)

```Typescript routeModules.ts
export interface RouteModule {
  clientAction?: ClientActionFunction;
  clientLoader?: ClientLoaderFunction;
  ErrorBoundary?: ErrorBoundaryComponent;
  HydrateFallback?: HydrateFallbackComponent;
  Layout?: LayoutComponent;
  default: RouteComponent;
  handle?: RouteHandle;
  links?: LinksFunction;
  meta?: MetaFunction;
  shouldRevalidate?: ShouldRevalidateFunction;
}

export async function loadRouteModule(
  route: EntryRoute,
  routeModulesCache: RouteModules
): Promise<RouteModule> {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id] as RouteModule;
  }

  try {
    let routeModule = await import(/* webpackIgnore: true */ route.module);
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error: unknown) {
     console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);

    if (
      window.__remixContext.isSpaMode &&
      // @ts-expect-error
      typeof import.meta.hot !== "undefined"
    ) {
       throw error;
    }

    window.location.reload();

    return new Promise(() => {
     });
  }
}
```

[links.ts](https://github.com/remix-run/remix/blob/0e9772c8b4456c239ea148c4003932ce63a7198e/packages/remix-react/links.ts#L8)

```Typescript links.ts
export async function getKeyedPrefetchLinks(
  matches: AgnosticDataRouteMatch[],
  manifest: AssetsManifest,
  routeModules: RouteModules
): Promise<KeyedHtmlLinkDescriptor[]> {
  let links = await Promise.all(
    matches.map(async (match) => {
      let mod = await loadRouteModule(
        manifest.routes[match.route.id],
        routeModules
      );
      return mod.links ? mod.links() : [];
    })
  );
```

[components.tsx](https://github.com/remix-run/remix/blob/0e9772c8b4456c239ea148c4003932ce63a7198e/packages/remix-react/components.tsx#L44)

```Typescript components.tsx
function useKeyedPrefetchLinks(matches: AgnosticDataRouteMatch[]) {
  let { manifest, routeModules } = useRemixContext();

  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React.useState<
    KeyedHtmlLinkDescriptor[]
  >([]);


  // マッチしたルートが変わるたびにリンクを再計算
  React.useEffect(() => {
    let interrupted: boolean = false;

    // getKeyedPrefetchLinksを非同期で呼び出し
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        // コンポーネントがアンマウントされていなければstateを更新
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );

    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);

  return keyedPrefetchLinks;
}
```

[!Important]最終的にLinks()としてexportされる。

## まとめ

1. loaderの利点

- 効率的なデータ取得
- データの再利用
- 部分的なUIレンダリング

2. useLoaderDataはクライアント側又は
   サーバー側のloaderかで型を調整している。
3. loaderはLinksコンポーネントによって検知され、
   変更があるたびにプリフェッチされる。
