const axios = require('axios');

exports.get_top_posts_by_comment = async (req, res, next) => {
    let limit = req.query.limit || 10
    let comments = null
    comments = await axios.get("https://jsonplaceholder.typicode.com/comments", {
        headers: { "Accept-Encoding": "gzip,deflate,compress" }
    })
        .then(res_comments => {
            return res_comments.data
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error})
        })
    
    let post_obj = {}
    comments.forEach(comment => {
        if (!(comment.postId in post_obj)) {
            post_obj[comment.postId] = 0
        }
        post_obj[comment.postId] += 1
    });

    let top_ten_posts = []
    top_ten_posts = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {headers: { "Accept-Encoding": "gzip,deflate,compress" }})
        .then(res => {
            return res.data
        })
        .catch(error => {
            console.log(error)
            return null
        })

    let response_data = top_ten_posts.map(p => { return {
        post_id: p.id,
        post_title: p.title,
        post_body: p.body,
        total_number_of_comments: post_obj[p.id]
    }})
    // sorted = Object.keys(response_data).sort((a, b) => { return response_data[total_number_of_comments] - presponse_dataost_obj[total_number_of_comments] })
    response_data.sort((a, b) => { return b.total_number_of_comments - a.total_number_of_comments })
    res.status(200).json({data: response_data, length: response_data.length})
}


exports.filter_comments = async (req, res, next) => {
    // filterable fields:
    // - postId
    // - id
    // - name
    // - email
    // - body

    // get all filterable fields from params
    params_keys = Object.keys(req.query)
    let filterable_fields = {}
    for (let k = 0; k < params_keys.length; k++) {
        if (req.query[params_keys[k]] != null) filterable_fields[params_keys[k]] = req.query[params_keys[k]]
    }
    // Object.keys(filterable_fields).forEach(key => {
    //     if (filterable_fields[key] === null) delete filterable_fields[key]
    // })
    
    // fetch comments
    let comments = null
    comments = await axios.get("https://jsonplaceholder.typicode.com/comments", {
        headers: { "Accept-Encoding": "gzip,deflate,compress" }
    })
        .then(res_comments => {
            return res_comments.data
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error})
        })
    
    // start filtering
    let filters = Object.keys(filterable_fields)
    let filtered_comments = []

    for (let c = 0; c < comments.length; c++) {
        let comment = comments[c]
        check_status = []
        if (filters.length > 0) {
            for (let i = 0; i < filters.length; i++) {
                let key = filters[i]
                // TODO: catch error if key not in comment
                check_status.push(comment[key] == filterable_fields[key] ? true : false)
            }
        }
        else check_status.push(true)
        
        if (check_status.every(Boolean)) filtered_comments.push(comment)
    }

    res.status(200).json({comments: filtered_comments, length: filtered_comments.length})
}