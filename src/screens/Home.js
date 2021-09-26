import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'
import { Link } from 'react-router-dom'
const Home = () => {

    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/allposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id,
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        //updating likes record
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id,
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        //updating likes record
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text,
            })

        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        //updating comments record
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                //filtering out deleted post
                const newData = data.filter(item => {
                    return item.id !== result._id
                })
                setData(newData)
            })
    }

    return (
        <div className="home">

            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>
                                <Link to={ item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"}>{item.postedBy.name}</Link>
                                </h5>

                            <div className="card-image">
                                <img src={item.photo} alt="personimg" />
                            </div>

                            <div className="card-content">
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons" style={{ color: "red" }}
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    :
                                    <i className="material-icons" style={{ color: "blue" }}
                                        onClick={() => { likePost(item._id) }}>thumb_up</i>
                                }

                                {
                                    item.postedBy._id == state._id  &&
                                    <i className="material-icons" style={{ float: 'right' }}
                                    onClick={() => deletePost(item._id)}
                                    >delete</i>

                                }
                                




                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}>
                                                <span style={{ fontWeight: "500" }}>
                                                    {record.postedBy.name}
                                                </span>
                                                {record.text}
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    // console.log(e.target[0].value)
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }







        </div>
    )
}

export default Home
