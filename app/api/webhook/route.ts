import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface EmailAddress {
  email_address: string;
  id: string;
  object: string;
  verification: {
    status: string;
    strategy: string;
  };
}

interface UserWebhookData {
  id: string;
  username: string | null;
  email_addresses: EmailAddress[];
  image_url: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string;
}

const webhookSecret = process.env.WEBHOOK_SECRET;

async function handler(request: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret || "");

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }

  const eventType = evt.type;
  const { data } = evt;

  if (eventType === "user.created") {
    const userData = data as unknown as UserWebhookData;

    try {
      const username =
        userData.username ||
        `${userData.first_name || ""}${userData.last_name || ""}`.toLowerCase() ||
        userData.id.slice(0, 8);

      // Add a temporary password (you can adjust this as needed)
      const password = "defaultPassword123"; // or use `null` or any default value

      // Create the user with the password field
      await prisma.user.create({
        data: {
          userId: userData.id,
          username: username,
          email: userData.email_addresses[0]?.email_address,
          imageUrl: userData.profile_image_url || userData.image_url,
          role: "user",
          theme: "light",
          password: password, // provide a default password
        },
      });

      return new NextResponse("User created", { status: 200 });
    } catch (error) {
      console.error("Error creating user:", error);
      return new NextResponse("Error creating user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const userData = data as unknown as UserWebhookData;

    try {
      await prisma.user.update({
        where: { userId: userData.id },
        data: {
          username: userData.username || undefined,
          email: userData.email_addresses[0]?.email_address,
          imageUrl: userData.profile_image_url || userData.image_url,
        },
      });

      return new NextResponse("User updated", { status: 200 });
    } catch (error) {
      console.error("Error updating user:", error);
      return new NextResponse("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const userData = data as unknown as UserWebhookData;

    try {
      await prisma.user.delete({
        where: { userId: userData.id },
      });

      return new NextResponse("User deleted", { status: 200 });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new NextResponse("Error deleting user", { status: 500 });
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}

export const POST = handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
