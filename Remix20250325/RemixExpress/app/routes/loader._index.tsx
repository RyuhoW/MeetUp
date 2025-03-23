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
