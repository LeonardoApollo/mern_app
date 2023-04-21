import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import { TabContext, TabList, TabPanel, } from '@mui/lab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const [value, setValue] = React.useState('1')
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const postsArray = posts.items;
  const filter = [ ...postsArray].sort((a, b) => b.viewsCount - a.viewsCount) 

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <TabContext value={value}>
        <TabList style={{ marginBottom: 15 }} aria-label="basic tabs example" onChange={handleChange}>
          <Tab label="Новые" value="1" />
          <Tab label="Популярные" value="2" />
        </TabList>
        <TabPanel value="1">
          <Grid container spacing={4}>
            <Grid xs={8} item>
              {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostsLoading ? (
              <Post key={index} isLoading={true}/>
              ) : (
                <Post
                  key = {`${index}`+ Date.now()}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              ))}
            </Grid>
            <Grid xs={4} item>
              <TagsBlock items={tags.items} isLoading={isTagsLoading} />
              <CommentsBlock
                items={[
                  {
                    user: {
                      fullName: 'Вася Пупкин',
                      avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                    },
                    text: 'Это тестовый комментарий',
                  },
                  {
                    user: {
                      fullName: 'Иван Иванов',
                      avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                    },
                    text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                  },
                ]}
                isLoading={false}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value="2">
        <Grid container spacing={4}>
            <Grid xs={8} item>
              {(isPostsLoading ? [...Array(5)] : filter).map((obj, index) => isPostsLoading ? (
              <Post key={index} isLoading={true}/>
              ) : (
                <Post
                  key = {`${index}`+ Date.now()}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              ))}
            </Grid>
            <Grid xs={4} item>
              <TagsBlock items={tags.items} isLoading={isTagsLoading} />
              <CommentsBlock
                items={[
                  {
                    user: {
                      fullName: 'Вася Пупкин',
                      avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                    },
                    text: 'Это тестовый комментарий',
                  },
                  {
                    user: {
                      fullName: 'Иван Иванов',
                      avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                    },
                    text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                  },
                ]}
                isLoading={false}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
    </>
  );
};
