class ProcessError extends Error {
    constructor(message) {
        super(message);

    }
}

async function processUserData(userId) {
    try {
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!userResponse.ok) {
            throw new ProcessError('Failed to fetch user data');
        }
        const userData = await userResponse.json();

        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!postResponse.ok) {
            throw new ProcessError('Failed to fetch posts');
        }
        const posts = await postResponse.json();

        const firstPostId = posts[0].id;
        const commentResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${firstPostId}`);
        if (!commentResponse.ok) {
            throw new ProcessError('Failed to fetch comments');
        }
        const comments = await commentResponse.json();

        console.log('User Data:', userData);
        console.log('Posts:', posts);
        console.log('Comments for the first post:', comments);
    } catch (error) {
        if (error instanceof ProcessError) {
            console.error(`Message: ${error.message}`);
        } else {
            console.error('An unexpected error occurred:', error);
        }
    } finally {
        console.log('Processing completed.');
    }
}

processUserData(1);