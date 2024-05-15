import axios from "axios";

const LIMIT = 5;

export async function fetchItems({ pageParam }) {
  try {
    const res = await axios.get("http://localhost:4000/api/items");
    return {
      data: res.data.slice(pageParam, pageParam + LIMIT),
      currentPage: pageParam,
      nextPage: pageParam + LIMIT < res.data.length ? pageParam + LIMIT : null
    };
  } catch (err) {
    throw err;
  }
}