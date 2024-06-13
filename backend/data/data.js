const fs = require("fs").promises;
const path = require("path");

// 데이터 파일 경로
const dataFilePath = path.join(__dirname, "data.json");

// 데이터 파일에서 게시글을 로드하는 함수
const loadPosts = async () => {
	try {
		// utf8 인코딩을 사용하여 문자열로 변환
		const data = await fs.readFile(dataFilePath, "utf8");
		// JSON 형식으로 변환하여 반환
		return JSON.parse(data);
	} catch (error) {
		if (error.code === "ENOENT") {
			// 파일이 존재하지 않을 경우 빈 배열 반환
			return [];
		} else {
			// 다른 종류의 에러일 경우 에러를 다시 던짐
			throw error;
		}
	}
};

// 게시글 데이터를 파일에 저장하는 함수
const savePosts = async (posts) => {
	try {
		// JSON.stringify를 사용하여 JSON 형식의 문자열로 변환
		const jsonString = JSON.stringify(posts, null, 2);
		// 파일에 데이터를 씀
		await fs.writeFile(dataFilePath, jsonString, "utf8");
	} catch (error) {
		// 파일 쓰기 중 에러 발생 시 에러를 다시 던짐
		throw error;
	}
};

module.exports = { loadPosts, savePosts };
