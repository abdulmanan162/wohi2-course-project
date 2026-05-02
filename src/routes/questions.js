function formatPost(post) {
  return {
    ...post,
    date: post.date.toISOString().split("T")[0],
    keywords: post.keywords.map((k) => k.name),
  };
}

// const express = require("express");
// const router = express.Router();
// const prisma = require("../lib/prisma");

// const posts = require("../data/posts");

// // GET /posts
// // List all posts
// router.get("/", (req, res) => {
//   res.json(posts);
// });

// // GET /posts/:postId
// // Show a specific post
// router.get("/:postId", async (req, res) => {
//   const postId = Number(req.params.postId);
//   const post = await prisma.post.findUnique({
//     where: { id: postId },
//     include: { keywords: true },
//   });

//   if (!post) {
//     return res.status(404).json({ 
// 		message: "Post not found" 
//     });
//   }

//   res.json(formatPost(post));
// });


// router.get("/", async (req, res) => {
//   const { keyword } = req.query;

//   const where = keyword
//     ? { keywords: { some: { name: keyword } } }
//     : {};

//   const posts = await prisma.post.findMany({
//     where,
//     include: { keywords: true },
//     orderBy: { id: "asc" },
//   });

//   res.json(posts.map(formatPost));
// });


// // POST /posts
// // Create a new post
// router.post("/", (req, res) => {
//   // const { question, answer } = req.body;
//   const { question, answer } = req.body || {};

//   if (!question || !answer) {
//     return res.status(400).json({
//       message: "question and answer are required"
//     });
//   }

//   const maxId = Math.max(...posts.map((p) => p.id), 0);

//   const newPost = {
//     id: posts.length ? maxId + 1 : 1,
//     question,
//     answer
//   };

//   posts.push(newPost);
//   res.status(201).json(newPost);
// });

// router.post("/", async (req, res) => {
//   const { title, date, content, keywords } = req.body;

//   if (!title || !date || !content) {
//     return res.status(400).json({ msg: 
// 	"title, date and content are mandatory" });
//   }

//   const keywordsArray = Array.isArray(keywords) ? keywords : [];

//   const newPost = await prisma.post.create({
//     data: {
//       title, date: new Date(date), content,
//       keywords: {
//         connectOrCreate: keywordsArray.map((kw) => ({
//           where: { name: kw }, create: { name: kw },
//         })), },
//     },
//     include: { keywords: true },
//   });

//   res.status(201).json(formatPost(newPost));
// });

// // PUT /posts/:postId
// // // Edit a post
// // router.put("/:postId", (req, res) => {
// //   const postId = Number(req.params.postId);
// //   // const { question, answer } = req.body;
// //   const { question, answer } = req.body || {};

// //   const post = posts.find((p) => p.id === postId);

// //   if (!post) {
// //     return res.status(404).json({ message: "Post not found" });
// //   }

// //   if (!question || !answer) {
// //     return res.status(400).json({
// //       message: "question and answer are required"
// //     });
// //   }

// //   post.question = question;
// //   post.answer = answer;

// //   res.json(post);
// // });
// outer.put("/:postId", async (req, res) => {
//   const postId = Number(req.params.postId);
//   const { title, date, content, keywords } = req.body;
//   const existingPost = await prisma.post.findUnique({ where: { id: postId } });
//   if (!existingPost) {
//     return res.status(404).json({ message: "Post not found" });
//   }

//   if (!title || !date || !content) {
//     return res.status(400).json({ msg: "title, date and content are mandatory" });
//   }

//   const keywordsArray = Array.isArray(keywords) ? keywords : [];
//   const updatedPost = await prisma.post.update({
//     where: { id: postId },
//     data: {
//       title, date: new Date(date), content,
//       keywords: {
//         set: [],
//         connectOrCreate: keywordsArray.map((kw) => ({
//           where: { name: kw },
//           create: { name: kw },
//         })),
//       },
//     },
//     include: { keywords: true },
//   });
//   res.json(formatPost(updatedPost));
// });


// // DELETE /posts/:postId
// // // Delete a post
// // router.delete("/:postId", (req, res) => {
// //   const postId = Number(req.params.postId);
// //   const postIndex = posts.findIndex((p) => p.id === postId);

// //   if (postIndex === -1) {
// //     return res.status(404).json({ message: "Post not found" });
// //   }

// //   const deletedPost = posts.splice(postIndex, 1);

// //   res.json({
// //     message: "Post deleted successfully",
// //     post: deletedPost[0]
// //   }); 
// // });

// router.delete("/:postId", async (req, res) => {
//   const postId = Number(req.params.postId);

//   const post = await prisma.post.findUnique({
//     where: { id: postId },
//     include: { keywords: true },
//   });

//   if (!post) {
//     return res.status(404).json({ message: "Post not found" });
//   }

//   await prisma.post.delete({ where: { id: postId } });

//   res.json({
//     message: "Post deleted successfully",
//     post: formatPost(post),
//   });
// });



// module.exports = router;
const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");

const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");

// GET /posts
// List all posts
router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { id: "asc" },
  });

  res.json(posts);
});
router.use(authenticate);
// GET /posts/:postId
// Show a specific post
router.get("/:postId", async (req, res) => {
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  res.json(post);
});

// POST /posts
// Create a new post
router.post("/", async (req, res) => {
  const { question, answer } = req.body || {};

  if (!question || !answer) {
    return res.status(400).json({
      message: "question and answer are required",
    });
  }

  const newPost = await prisma.post.create({
    data: {
      question,
      answer,
      userId: req.user.userId,

    },
  });

  res.status(201).json(newPost);
});

// PUT /posts/:postId
// Edit a post
router.put("/:postId",isOwner, async (req, res) => {
  const postId = Number(req.params.postId);
  const { question, answer } = req.body || {};

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (!question || !answer) {
    return res.status(400).json({
      message: "question and answer are required",
    });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      question,
      answer,
    },
  });

  res.json(updatedPost);
});

// DELETE /posts/:postId
// Delete a post
router.delete("/:postId", isOwner,async (req, res) => {
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  res.json({
    message: "Post deleted successfully",
    post,
  });
});

module.exports = router;