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

export default function hello() {
  const remixMeetup: string = loader();
  return (
    <>
    <h1>{remixMeetup}</h1>
      // hello world
    </>
  )
}

function loader(): string {
  const text: string = useLoaderData();
  return text;
}
```

```Typescript {filename="loader.server.ts"}
const loader = (): string => "hello world"
export default loader;
```

## useLoaderDataの実力とは

Demo

```sh
npm run build
npm run dev
```

[PefromanceTest](http://localhost:3000/performance)

## useLoaderDataの深堀り解説
