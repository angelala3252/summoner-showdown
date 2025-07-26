import type { Route } from "./+types/home";
import { HomePage } from "../pages/home/home-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Summoner Showdown" },
    { name: "description", content: "Welcome to Summoner Showdown!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
``