import { IgApiClient } from "instagram-private-api";

const ig = new IgApiClient();

ig.state.generateDevice("Device");

(async () => {
    await ig.account.login("username", "pAssWOrd");

    const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
    const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);

    const followers = await getAllItemsFromFeed(followersFeed);
    const following = await getAllItemsFromFeed(followingFeed);

    const followersUsername = new Set(followers.map(({ username }) => username));
    const followingUsername = new Set(following.map(({ username }) => username));

    const notFollowingYou = following.filter(
        ({ username }) => !followersUsername.has(username),
    );
    const youNotFollowing = followers.filter(
        ({ username }) => !followingUsername.has(username),
    );

    // Separando perfis verificados
    const verifiedFollowers = followers.filter(({ is_verified }) => is_verified);
    const verifiedFollowing = following.filter(({ is_verified }) => is_verified);
    const verifiedNotFollowingYou = notFollowingYou.filter(({ is_verified }) => is_verified);
    const verifiedYouNotFollowing = youNotFollowing.filter(({ is_verified }) => is_verified);

    console.log("Seguidores:", followers.map(({ username }) => username));
    console.log("Seguindo:", following.map(({ username }) => username));
    console.log("Não seguindo você:", notFollowingYou.map(({ username }) => username));
    console.log("Você não segue de volta:", youNotFollowing.map(({ username }) => username));

    // Exibindo perfis verificados
    console.log("Perfis verificados que seguem você:", verifiedFollowers.map(({ username }) => username));
    console.log("Perfis verificados que você segue:", verifiedFollowing.map(({ username }) => username));
    console.log("Perfis verificados que não seguem você de volta:", verifiedNotFollowingYou.map(({ username }) => username));
    console.log("Perfis verificados que você não segue de volta:", verifiedYouNotFollowing.map(({ username }) => username));
})();

async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}
