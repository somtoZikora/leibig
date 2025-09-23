import { currentUser } from "@clerk/nextjs/server";
import Header from "./Header";

export default async function HeaderWrapper() {
  const user = await currentUser();

  return <Header user={user} />;
}
