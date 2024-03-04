import axios from 'axios';

const KEY = '32131085-77c33ae4af62fbdfe36accafe';
const BASE_URL = 'https://pixabay.com/api/';

export const getImagesApi = async (searchValue, page) => {
  const { data } = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${searchValue}&page=${page}&per_page=12&image_type=photo&orientation=horizontal`
  );
  return data;
};
