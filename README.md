# HEBUTba

forum of hebut

![Detail4Snippets](./public/img/example1.png)

## features(51 points)：
- [x] Basic features
- [x] Users can edit their own comments/posts
- [x] Utilization of a frontside framework, React
- [x] Use some highlight library for the code snippets(ReactMarkdown)
- [x] Use of a pager when there is more than n posts available
- [x] Admin account with rights to edit all the post and comments and delete content (if a post is removed, all its comments should be removed too)
- [x] Vote (up or down) posts and comments (only one vote per user)
- [x] User profiles can have images which are show next to posts
- [x] Last edited timestamp is stored and shown with posts/comments

## installation guidelines

### Installation dependency
Enter the root directory
```
npm install
```
then
```
npm preinstall
```
### Run
Start the server end in development mode
```
SET NODE_ENV=development& npm run dev:server
```
then start the front end
```
npm run dev:client
```
### user manual
#### Sign in
![login](./public/img/howtolog.png)
Click here to log in. You cannot comment or post codeSnippet without logging in.

#### Sing up
![signup](./public/img/signup.png)

Sign up interface.
Please note that your password type must be a strong password combination (at least one uppercase and lowercase letter, and contain numbers and special symbols)

![rolecode](./public/img/rolecode.png)  
You can obtain the identity of the administrator by entering the administrator code defined on the server (delete anyone's posts and comments)

####
