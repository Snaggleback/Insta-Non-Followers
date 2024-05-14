import { IgApiClient } from "instagram-private-api";

const ig = new IgApiClient();

ig.state.generateDevice("Device");

(async () => {
    await ig.account.login("username", "pAssWOrd");

    const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
    const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);

    const followers = await getAllItemsFromFeed(followersFeed);
    const following = await getAllItemsFromFeed(followingFeed);
    // Making a new map of users username that follow you.
    const followersUsername = new Set(
        followers.map(({ username }) => username),
    );
    const followingUsername = new Set(
        following.map(({ username }) => username),
    );
    // Filtering through the ones who aren't following you.
    const notFollowingYou = following.filter(
        ({ username }) => !followersUsername.has(username),
    );
    const youNotFollowing = followers.filter(
        ({ username }) => !followingUsername.has(username),
    );
    console.log(
        "Seguidores:",
        followers.map(({ username }) => username),
        "Seguindo:",
        following.map(({ username }) => username),
        "Não seguindo você:",
        notFollowingYou.map(({ username }) => username),
        "Você não segue de volta:",
        youNotFollowing.map(({ username }) => username),
    );
})();

async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}
