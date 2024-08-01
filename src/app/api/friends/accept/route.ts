import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z
      .object({
        id: z.string(),
      })
      .parse(body);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    //verify both are not already friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already Friends", { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No Friend Request from here", { status: 400 });
    }

    await db.sadd(`user:${session.user.id}:friends`,idToAdd);
    await db.sadd(`user:${idToAdd}:friends`,session.user.id);

    await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToAdd)
    console.log("hasFriendRequest: ", hasFriendRequest);

    return new Response("Request Sent");
  } catch (error) {
    if(error instanceof z.ZodError){
        return new Response('Invalid Request Payload',{status:422})
    }
    return new Response('Invalid Request',{status:400})
  }
}
