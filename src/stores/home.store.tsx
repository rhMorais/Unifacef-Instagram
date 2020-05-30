import {action, observable} from 'mobx';

import {Post, getPosts} from '../apis/posts.api';

export default class HomeStore {
  @observable photoReady: boolean = false;

  @observable posts: Post[] = [];

  @observable loading: boolean = false;

  @action getPosts = async () => {
    this.loading = true;
    try {
      const posts = await getPosts();
      this.posts = posts;
      console.log('success');
    } catch (err) {
      console.log(err);
      this.posts = [];
      throw err;
    } finally {
      this.loading = false;
    }
  };

  @action addPost = (uriPhoto: string) => {
    const post: Post = {
      author: {
        id: 5,
        name: 'rafael_morais',
        avatar: 'https://avatars0.githubusercontent.com/u/30928122?s=50',
      },
      authorId: 5,
      description: 'sem legenda',
      id: this.posts.length + 1,
      image: uriPhoto,
    };

    this.posts.unshift(post);
  };

  @action toogleStatus = (status: boolean) => {
    this.photoReady = status;
  };
}

const homeStore = new HomeStore();
export {homeStore};
