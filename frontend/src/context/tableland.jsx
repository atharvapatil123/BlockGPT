import { Database } from "@tableland/sdk";
import { Wallet, ethers } from "ethers";

const privateKey =
    "74727a21e67972b6f8acc6c45ad157351c9cb527a7bf8cf10c7efebfa5016208";
const provider = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/f7d93a7b2f68495995120e9486e1e423"
);

const wallet = new Wallet(privateKey, provider);
const signer = wallet.connect(provider);
const db = new Database({ signer });

const users_table = "user_data_11155111_375";
const posts_table = "posts_new_data_11155111_377";

export const getUsersData = async () => {
    const stmt = db.prepare(`SELECT * FROM ${users_table};`);
    const { results } = await stmt.all();
    console.log("results");
    console.log(results);
    return results;
};

export const getUserById = async (address) => {
    const stmt = db.prepare(
        `SELECT * FROM ${users_table} where wallet_address='${address}';`
    );
    const { results } = await stmt.all();
    console.log("results");
    console.log(results);
    return results;
};

export const registerUserToDB = async (
    username,
    wallet_address,
    dob,
    gender,
    aadhar_hash,
    city
) => {
    const { meta: insert } = await db
        .prepare(
            `INSERT INTO ${users_table} (username, wallet_address, dob, gender, aadhar_hash, city, positive_score, negative_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
        )
        .bind(username, wallet_address, dob, gender, aadhar_hash, city, 0, 0)
        .run();

    await insert.txn?.wait();
};

export const fetchPosts = async () => {
    const stmt = db.prepare(`SELECT * FROM ${posts_table}`);
    const { results } = await stmt.all();
    // const _results = results.sort((a, b)=>b["likes"] - a["likes"])
    return results;
};

export const fetchPostsById = async (post_id) => {
    const stmt = db.prepare(`SELECT * FROM ${posts_table} where id=${post_id};`);
    const {results} = await stmt.all();
    // const _results = results.sort((a, b)=>b["likes"] - a["likes"])
    return results[0];
};


export const addPostToDB = async (
    title,
    wallet_address,
    coordinates,
    type,
    content,
    approved,
    timestamp
) => {
    const { meta: insert } = await db
        .prepare(
            `INSERT INTO ${posts_table} (title,wallet_address,coordinates,type,content, approved,timestamp) VALUES (?, ?, ?, ?, ?, ?, ?);`
        )
        .bind(
            title,
            wallet_address,
            coordinates,
            type,
            content,
            approved,
            timestamp
        )
        .run();

    await insert.txn?.wait();
    console.log("Inserted");
};

export const likePostToDB = async (postId, wallet_address) => {
    const stmt = db.prepare(
        `SELECT * FROM ${posts_table} WHERE id = ${postId}`
    );
    const { results } = await stmt.all();
    if (results.length > 0) {
        const post = results[0];
        let isAdded = true;
        if(post.content && post.content.likes){
            if(post.content.likes.includes(wallet_address)){
                post.content.likes.splice(post.content.likes.indexOf(wallet_address), 1);
                isAdded = false;
            }else{
                post.content.likes.push(wallet_address);
                isAdded = true;
            }
        }
        
        const { meta: update } = await db
            .prepare(`UPDATE ${posts_table} SET content=? WHERE id = ${postId};`)
            .bind(JSON.stringify(post.content))
            .run();

        await update.txn?.wait();
        console.log("Liked!");
        return isAdded;
    }
    return false;
};

export const getCommentsByPostId = async(post_ids) => {
    const stmt = db.prepare(`SELECT * FROM ${posts_table} WHERE id in (${post_ids.join(",")});`);
    const { results } = await stmt.all();
    return results;
}

export const addCommentToDB = async(post_id,title,wallet_address,coordinates,type,content, approved,timestamp) => {
    const { meta: insert } = await db
        .prepare(`INSERT INTO ${posts_table} (title,wallet_address,coordinates,type,content, approved,timestamp) VALUES (?, ?, ?, ?, ?, ?, ?);`)
        .bind(title,wallet_address,coordinates,type,content, approved,timestamp)
        .run();

    const data = await insert.txn?.wait();
    // console.log("Inserted");

    const stmt = db.prepare(`SELECT * FROM ${posts_table} ORDER BY Id desc LIMIT 1;`);
    const { results } = await stmt.all();
    console.log(results[0],"new comment");

    const oldPost = await fetchPostsById(post_id);
    console.log(oldPost,"old post");

    
    let postContent = oldPost.content;
    console.log(postContent,"post content")
    postContent.supportIds.push(results[0].id);

    console.log(postContent,"newPostContent")
    
    const { meta: update } = await db
        .prepare(`UPDATE ${posts_table} SET content = ? WHERE Id=${post_id}; `)
        .bind(JSON.stringify(postContent))
        .run();
    
    const updateData = await update.txn?.wait();
    console.log(updateData,"updated data");
}

export const increaseUserPositiveScoreCount = async (address) => {
    const { meta: insert } = await db
        .prepare(
            `UPDATE ${users_table} SET positive_score=positive_score+1 WHERE wallet_address='${address}';`
        )
        .run();

    await insert.txn?.wait();
    console.log("Inserted");
};

// export const increasePostLikeCount = async(post_id) =>{

//     const { meta: insert } = await db
//         .prepare(f`UPDATE ${posts_table} SET likes=likes+1 WHERE id='${post_id}';`)
//         .run();

//     await insert.txn?.wait();
//     console.log("Inserted");
// }

export const deletePost = async (post_id) => {
    const { meta: insert } = await db
        .prepare(`DELETE ${posts_table} WHERE id='${post_id}';`)
        .run();

    await insert.txn?.wait();
    console.log("Deleted");
};

//TODO: combine above two to complete the process of liking a post just like you like her. (she'll never be yours, jerk)


export const approveCommentToDB = async(postId) => {
    const { meta: insert } = await db
        .prepare(`UPDATE ${posts_table} SET approved=${true} WHERE id=${postId};`)
        .run();

    await insert.txn?.wait();
    console.log("Inserted");
}

export const disapproveCommentToDB = async(postId) => {
    const { meta: insert } = await db
        .prepare(`UPDATE ${posts_table} SET approved=${false} WHERE id=${postId};`)
        .run();

    await insert.txn?.wait();
    console.log("Inserted");
}


