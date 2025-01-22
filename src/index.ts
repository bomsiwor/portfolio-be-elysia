import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from "@prisma/client";

// Setup prisma
const prisma = new PrismaClient({
  log: [
    'info'
  ]
});

const app = new Elysia();

// Add route
app
  .use(swagger())
  .onTransform(({ path, request: { method }, body, params }) => {
    console.log(`${path} | ${method}`, {
      body,
      params,
    })
  })
  .get("/", () => {
    return { message: "Hello Universe" }
  })
  .get("/blog/:slug/comments", async ({ params: { slug } }) => {
    // Get all blog comments
    const comments = await prisma.blogComment.findMany({
      where: {
        blogSlug: slug
      },
      orderBy: {
        id: "desc"
      }
    })

    return {
      data: comments
    }
  },
    {
      params: t.Object({
        slug: t.String()
      })
    })
  .post("/blog/:slug/comments", async ({ body, params: { slug }, set }) => {
    // Create blog comment
    const comment = await prisma.blogComment.create({
      data: {
        ...body,
        blogSlug: slug,
      },
    })

    // Set status
    set.status = 201;

    return {
      data: comment
    }
  },
    {
      body: t.Object({
        name: t.String(),
        body: t.String()
      })
    }
  );


// Listen to port
app.listen(3000)

console.log(
  `🦊 Bomsiwor BE Portfolio running at ${app.server?.hostname}:${app.server?.port}`
);
