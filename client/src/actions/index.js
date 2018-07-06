import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

export const fetchUser = () => async dispatch =>
  dispatch({
    type: FETCH_USER,
    payload: (await axios.get('/api/current_user')).data
  });

export const submitBlog = (values, file, history) => async dispatch => {
  // Get the presignedUrl from AWS S3
  const uploadConfig = await axios.get('/api/upload');

  // Issue a PUT request for the image file (an Object for AWS S3) to the
  // AWS S3 Bucket
  await axios.put(uploadConfig.data.url, file, {
    headers: {
      'Content-Type': file.type
    }
  });

  const res = await axios.post('/api/blogs', {
    ...values,
    imageUrl: uploadConfig.data.key
  });

  // Redirect the user the /blogs route - The Dashboard
  history.push('/blogs');
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async dispatch => {
  const res = await axios.get('/api/blogs');

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = id => async dispatch => {
  const res = await axios.get(`/api/blogs/${id}`);
  console.log('res:', res);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
