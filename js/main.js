// 1. createElemWithText
function createElemWithText(elementName = "p", textContent = "", className) {

    const element = document.createElement(elementName);
    element.textContent = textContent;

    if (className) {
        element.className = className;
    }
    return element;
}

// 2. createSelectOptions
function createSelectOptions(usersData) {

    if (!usersData) {
        return undefined;
    }

    const optionsArray = [];

    for (const user of usersData) {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        optionsArray.push(option);
    }
    return optionsArray;
}

// 3. toggleCommentSection
function toggleCommentSection(postId) {

    if (postId === undefined || postId === null) {
        return undefined;
    }

    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
        section.classList.toggle('hide');
    } else {
        return null;
    }
    return section;
}

// 4. toggleCommentButton
function toggleCommentButton(postId) {
    
    if (postId === undefined || postId === null) {
        console.error("post ID required.");
        return undefined;
    }

    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    if (button) {
        button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    }
    return button;
}

// 5. deleteChildElements
function deleteChildElements(parentElement) {

    if (!(parentElement instanceof Element)) {
        return undefined;
    }

    let child = parentElement.lastElementChild;

    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// 6. addButtonListeners
function addButtonListeners() {

    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0) {

        buttons.forEach((button) => {

            const postId = button.dataset.postId;
            if (postId) {

                button.addEventListener('click', (event) => {
                    toggleComments(event, postId);
                });
            }

        });
        return buttons;
    } else {
        return buttons;
    }
}

// 7. removeButtonListeners
function removeButtonListeners() {

    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0) {

        buttons.forEach((button) => {
            const postId = button.dataset.id;

            if (postId) {
                button.removeEventListener('click', toggleComments);
            }
        });
        return buttons;

    } else {
        return buttons;
    }
}

// 8. createComments
function createComments(commentsData) {

    if (!commentsData) {
        return undefined;
    }
    const fragment = document.createDocumentFragment();

    commentsData.forEach(comment => {
        const article = document.createElement('article');
        const nameHeading = createElemWithText('h3', comment.name);
        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

        article.appendChild(nameHeading);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);

        fragment.appendChild(article);
    });

    return fragment;
}


// 9. populateSelectMenu
function populateSelectMenu(usersData) {
    if (!usersData) {
        return undefined;
    }

    const selectMenu = document.getElementById("selectMenu"); 
    const optionsArray = createSelectOptions(usersData);
    optionsArray.forEach(option => {
        selectMenu.appendChild(option);
    });

    return selectMenu;
}

// 10. getUsers
async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch users.`);
        }
        const usersData = await response.json();

        return usersData;

    } catch (error) {
        console.error(`Error in fetching users`);
        throw error;
    }
}

// 11. getUserPosts
async function getUserPosts(userId) {
    try {
        if (!userId) {
            throw new Error("user ID required.");
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);

        if (!response.ok) {
            throw new Error(`Failed to fetch posts for user.`);
        }

        const userPostsData = await response.json();
        return userPostsData;

    } catch (error) {
        console.error(`Error with fetching user posts.`);
        return undefined; 
    }
}

// 12. getUser
async function getUser(userId) {
    try {
        if (!userId) {
            throw new Error("user ID required.");
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch user.`);
        }

        const userData = await response.json();
        return userData;

    } catch (error) {
        console.error(`Error with fetching user data`);
        return undefined; 
    }
}

// 13. getPostComments
async function getPostComments(postId) {
    try {
        if (!postId) {
            throw new Error("post ID required.");
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);

        if (!response.ok) {
            throw new Error(`Failed to fetch comments for post.`);
        }

        const postCommentsData = await response.json();
        return postCommentsData;

    } catch (error) {
        console.error(`Error with fetching post comments.`);
        return undefined;
    }
}

// 14. displayComments
async function displayComments(postId) {
    try {
        if (!postId) {
            throw new Error("post ID required.");
        }

        const commentsSection = document.createElement('section');
        commentsSection.dataset.postId = postId;
        commentsSection.classList.add('comments', 'hide');

        const comments = await getPostComments(postId);

        const commentsFragment = createComments(comments);
        commentsSection.appendChild(commentsFragment);

        return commentsSection;
    } catch (error) {
        console.error(`Error in displaying comments.`);
        return undefined; 
    }
}

// 15. createPosts
async function createPosts(posts) {
    if (!posts) {
        return undefined;
    }

    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const bodyParagraph = createElemWithText('p', post.body);
        const postIdParagraph = createElemWithText('p', `Post ID: ${post.id}`);

        const author = await getUser(post.userId);

        const authorParagraph = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const companyCatchPhraseParagraph = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;

        const section = document.createElement('section');
        section.textContent = `Comments for Post ${post.id}`;
        section.classList.add('comments', 'hide');
        section.dataset.postId = post.id;

        article.appendChild(h2);
        article.appendChild(bodyParagraph);
        article.appendChild(postIdParagraph);
        article.appendChild(authorParagraph);
        article.appendChild(companyCatchPhraseParagraph);
        article.appendChild(button);
        article.appendChild(section);

        fragment.appendChild(article);
    }

    return fragment;
}


// 16. displayPosts
async function displayPosts(posts) {
    const mainElement = document.querySelector('main');
    
    const element = posts 
        ? await createPosts(posts)
        : (() => {
            const defaultParagraph = createElemWithText('p', 'Select an Employee to display their posts.');
            defaultParagraph.classList.add('default-text');
            return defaultParagraph;
        })();

    mainElement.appendChild(element);
    return element;
}


// 17. toggleComments
function toggleComments(event, postId) {
    try {
        event.target.listener = true;
        const sectionElement = toggleCommentSection(postId);

        const buttonElement = toggleCommentButton(postId);

        return [sectionElement, buttonElement];

    } catch (error) {

        console.error(`Error in toggling comments.`);
        return undefined; 
    }
}


// 18. refreshPosts
async function refreshPosts(postsData) {
    try {
        if (!postsData) {
            throw new Error("posts data required.");
        }

        const removeButtons = removeButtonListeners();

        const mainElement = document.querySelector('main');

        const main = deleteChildElements(mainElement);

        const fragment = await displayPosts(postsData);

        const addButtons = addButtonListeners();

        return [removeButtons, main, fragment, addButtons];

    } catch (error) {
        console.error(`Error refreshing posts.`);
        return undefined; 
    }
}

// 19. selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    try {
        if (!event) {
            console.error('No event selected.');
            return undefined;
        }

        if (event.target) {
            event.target.disabled = true;
        }

        const userId = event.target?.value || 1;

        const posts = await getUserPosts(userId);

        const refreshPostsArray = await refreshPosts(posts);

        if (event.target) {
            event.target.disabled = false;
        }

        return [userId, posts, refreshPostsArray];

    } catch (error) {
        console.error(`Error in selectMenuChangeEventHandler.`);

        if (event && event.target) {
            event.target.disabled = false;
        }

        return [undefined, [], []];
    }
}

// 20. initPage
async function initPage() {
    try {
        const users = await getUsers();
        const select = await populateSelectMenu(users);

        return [users, select];

    } catch (error) {
        console.error(`Error in initPage.`);
        return [];
    }
}

// 21. initApp
function initApp() {
    initPage().then(([users, select]) => {

        const selectMenu = document.getElementById('selectMenu');

        selectMenu.addEventListener('change', (event) => {
            selectMenuChangeEventHandler(event);
        });

    });

}

document.addEventListener('DOMContentLoaded', initApp);
