// Node.js로 express 모듈을 불러옴
const express = require("express");
// Node.js로 body-parser 모듈을 불러옴
const bodyParser = require("body-parser");
const cors = require("cors");
// data.js 파일에서 loadPosts와 savePosts를 불러옴
const { loadPosts, savePosts } = require("./data/data");
// id생성기
const { v4: uuidv4 } = require("uuid");

// express 모듈을 사용하여 app을 생성
const app = express();
// 포트를 3000으로 설정
const port = 3000;

// body-parser를 사용하여 json 형식으로 데이터를 파싱
app.use(bodyParser.json());
app.use(cors());

// GET /posts 요청에 대한 응답
// 첫번째 인자는 요청 URL, 두번째 인자는 요청과 응답을 파라미터로 받는 콜백 함수
app.get("/posts", async (req, res) => {
	try {
		const posts = await loadPosts();
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Faild to load posts" });
	}
});

// POST /posts 요청에 대한 응답
app.post("/posts", async (req, res) => {
	try {
		const posts = await loadPosts();
		const post = req.body;
		post.id = uuidv4();
		posts.push(post);
		await savePosts(posts);
		res.status(201).json(post);
	} catch (error) {
		res.status(500).json({ message: "Faild to save posts" });
	}
});

// PUT /posts/:id 요청에 대한 응답
app.put("/posts/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const posts = await loadPosts();
		const index = posts.findIndex((post) => post.id === id);
		if (index !== -1) {
			const updatedPost = { id: posts[index].id, ...req.body };
			posts[index] = updatedPost;
			await savePosts(posts);
			res.json(updatedPost);
		} else {
			res.status(404).json({ message: `Post id ${id} not found` });
		}
	} catch (error) {
		res.status(500).json({ message: "Faild to update post" });
	}
});

// DELETE /posts/:id 요청에 대한 응답
app.delete("/posts/:id", async (req, res) => {
	// URL의 id 파라미터를 정수로 변환
	const id = parseInt(req.params.id);
	try {
		let posts = await loadPosts();
		// id와 일치하는 게시글을 제외한 게시글만 남김
		posts = posts.filter((post) => post.id !== id);
		await savePosts(posts);
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: "Faild to delete post" });
	}
});

// app을 포트 3000으로 실행
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
