import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../App'


const Profile = () => {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setPics(result.myPost)
            })
    }, [])

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")

            data.append('cloud_name', 'myinstamern')
            fetch('https://api.cloudinary.com/v1_1/myinstamern/image/upload', {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    setUrl(data.url);

                    console.log(data)
                    
                    
                    fetch('/updatepic',{
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                    .then(result=>{
                        console.log(result)
                        localStorage.setItem('user',JSON.stringify({...state,pic:result.pic}))
                        dispatch({type:"UPDATEPIC",payload:result.pic})
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
        
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '18px 0px',
                borderBottom: '1px solid grey'
            }}>
                <div>
                    <img style={{ width: "120px", height: "120px", borderRadius: "50%" }}
                        src={state ? state.pic : "loading"} alt="personimg" />


                    <div class="file-field input-field">
                        <div class="btn #448aff blue accent-2">
                            <span>Update pic</span>
                            <input type="file"
                            onChange={(e) => updatePhoto(e.target.files[0])}
                            />
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text"/>
                        </div>
                    </div>

                </div>


                <div>
                    <h4>{state ? state.name : "loading"}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "102%" }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state ? state.followers.length : "loading"} followers</h6>
                        <h6>{state ? state.following.length : "loading"} following</h6>
                    </div>
                </div>

            </div>


            <div className="gallery" >

                {
                    mypics.map(item => {

                        return (
                            <img key={item._id} src={item.photo} alt={item.title} className="item" />
                        )
                    })

                }



            </div>


        </div>
    )
}

export default Profile
