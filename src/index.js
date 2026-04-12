const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const postsRouter = require("./routes/posts");

app.use(express.json());

app.use("/api/posts", postsRouter);

app.use((req, res) => {
  res.status(404).json({ msg: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});