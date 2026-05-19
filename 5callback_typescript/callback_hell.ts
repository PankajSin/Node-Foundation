console.log('Starting script...');
type userCallback = (err: Error | null, result?: string) => void;
function getUser(id: number, callback: userCallback): void {
  setTimeout(() => {
    if (id === 1) {
      callback(null, 'Alice'); // Success!
    } else {
      callback(new Error('User not found')); // Error!
    }
  }, 1000);
}

type postCallback = (err: Error | null, result?: string[]) => void;
function getPosts(username: string, callback: postCallback): void {
  setTimeout(() => {
    console.log(`Fetching posts for: ${username}...`);
    if (username === 'Alice') {
      callback(null, ['Node.js Guide', 'TypeScript Tips', 'Async Patterns']);
    } else {
      callback(new Error('No posts found for this user'));
    }
  }, 1000);
}

type commentCallback = (err: Error | null, result?: string) => void;
function getComments(postTitle: string, callback: commentCallback): void {
  setTimeout(() => {
    console.log(`Fetching comments for: ${postTitle}...`);
    if (postTitle === 'Node.js Guide') {
      callback(null, 'Great article! This helped a lot.');
    } else {
      callback(new Error('Comments not found'));
    }
  }, 1000);
}
// 1. Start with ID 1
getUser(1, (err, user) => {
  if (err || !user) return console.error(err);

  getPosts(user, (err, posts) => {
    if (err || !posts) return console.error(err);

    getComments(posts[0], (err, comment) => {
      if (err) return console.error(err);

      console.log('Final message:', comment);
    });
  });
});
