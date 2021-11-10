exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: 'first post',
        content: 'thit is my first post!',
        imageUrl: 'images/2021-10-26-cursed02.jpg',
      },
    ],
  });
};

exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // crate post in db
  res.status(201).json({
    message: 'post created successfully',
    post: {
      id: new Date().toISOString().slice(0, 10),
      title: title,
      content: content,
    },
  });
};
