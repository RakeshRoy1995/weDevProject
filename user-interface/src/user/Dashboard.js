import axios from 'axios';
import cogoToast from 'cogo-toast';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { S3KEY } from '../Constant';
import { useSelector, useDispatch } from 'react-redux'
import { UploadToS3 } from '../common/UploadS3';

function Dashboard() { 
    const routerHistory = useHistory();
    const [data, setData] = useState([]);
    const [postStatusStore, setpostStatusStore] = useState('');
    const [addImageForPost, setaddImageForPost] = useState('');

    const userContactData = useSelector((state) => state.user_contact)

    const fetchData = async()=>{
        axios.get('all-posts')
        .then(function (response) {
            setData(response.data)

        }).catch(function (error) {
            if(error.response?.data.loginStatus == false){
                routerHistory.push("login");
                localStorage.removeItem("AuthUserToken")
            }
            cogoToast.error(error.response?.data.message , { position: 'top-right' } );
        });
    }

    const reply = async(e , post_id)=>{
        let insertData = {}
        insertData.content = e.target.parentElement.children[0].value
        insertData.post_id = post_id
        insertData.user_id = userContactData.id

        if(insertData.content){

            axios.post('storeComment', {
            insertData
            })
            .then(function (response) {
                e.target.parentElement.children[0].value = ""
                fetchData()
                cogoToast.success("Reply Done" , { position: 'top-right' } );
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
            });

        }
    }

    const storePost = async(e)=>{

        if (postStatusStore || addImageForPost) {
            if (addImageForPost) {

                console.log("addImageForPost", addImageForPost)
                await UploadToS3(addImageForPost, (response) => {
                    if(response.key)
                    {
                      var AuthUserToken = localStorage.getItem("AuthUserToken")
                      axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;
                      axios.post("/storePost/", {
                        post_content: postStatusStore,
                        user_id: userContactData.id,
                        image: 'public/'+ response.key
                        }).then(response => {
                          fetchData();
                          cogoToast.success("Status Posted" , { position: 'top-right' } );

                            document.getElementById('postimg').value =""
                            document.getElementById('statusStore').value =""

                            setpostStatusStore('')
                            setaddImageForPost('')
                      }).catch(function (error) {
                          if(error.response.data.loginStatus == false){
                              routerHistory.push("login");
                              localStorage.removeItem("AuthUserToken")
                          }
                          cogoToast.error(error.response.data.message , { position: 'top-right' } );
                      });
                    }
                
                });
                
            } else {
                var AuthUserToken = localStorage.getItem("AuthUserToken")
                axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;
                axios.post("/storePost/", {
                post_content: postStatusStore,
                user_id: userContactData.id,
                image: ''
                }).then(response => {
                    fetchData();

                    document.getElementById('postimg').value =""
                    document.getElementById('statusStore').value =""

                    setpostStatusStore('')
                    setaddImageForPost('')
                    cogoToast.success("Status Posted" , { position: 'top-right' } );
                }).catch(function (error) {
                    if(error.response.data.loginStatus == false){
                        routerHistory.push("login");
                        localStorage.removeItem("AuthUserToken")
                    }
                    cogoToast.error(error.response.data.message , { position: 'top-right' } );
                });
            }

            
            
        }
    }

    useEffect(() => {
        fetchData()
    } , []);
    
  return (
    <div className="right_content">

        <div className="">
            <div className="card">
                <div className="row">
                    <div className="col-md-12">

                        {
                            userContactData.activate == 1 ? <>

                        <textarea id='statusStore' placeholder='Write What is in your mind....' className='form-control' onChange={(e)=>setpostStatusStore(e.target.value)} row="50">
                        </textarea>
                        <br />

                        <input type="file" className='form-control' accept="image/png, image/gif, image/jpeg" id='postimg' onChange={(e)=>setaddImageForPost(e.target.files[0])}/>
                        <br />

                        <button className='btn btn-info' onClick={storePost}>Post Status</button>

                        </> : "Your Account is disable. You can not post anything"
                        }

                        

                        <h3 className="text-center mb-5"> </h3>
                        <div className="row">
                        <div className="col-md-12">


                            {
                                data?.map((collection , key)=>
                                
                                <div className="media mt-4" key={key}>
                                
                                    <img
                                        className="mr-3 rounded-circle"
                                        alt="Bootstrap Media Preview"
                                        src={S3KEY + collection.profile_image }
                                    />
                                    <div className="media-body">
                                        <div className="row">
                                        <div className="col-8 d-flex">
                                            <h5> { collection.name }</h5> <span style={{color: "#2041e5"}}> { collection.created_at } </span>
                                        </div>
                                        <div className="col-4"></div>
                                        </div>
                                        {
                                            collection.image && <><img src={S3KEY + collection.image} width="150px" /> <br /></> 
                                        }
                                        
                                        { collection.post_content }

                                        {
                                            collection?.comment?.map((comnt , key)=>
                                            
                                        
                                            <div className="media mt-4" key={key}>
                                            
                                                <a className="pr-3" href="#">
                                                    <img
                                                    className="rounded-circle"
                                                    alt="Bootstrap Media Another Preview"
                                                    src={S3KEY + comnt.profile_image }
                                                    />
                                                </a>
                                                <div className="media-body">
                                                    <div className="row">
                                                    <div className="col-12 d-flex">
                                                        <h5>{comnt.name}</h5> <span style={{color: "#2041e5"}}>{comnt.created_at}</span>
                                                    </div>
                                                    </div>
                                                    {comnt.content}
                                                </div>
                                            </div>
                                        )}

                                        <div className='row'>

                                            {
                                                userContactData.activate == 1 ? 
                                                <>
                                                <textarea  className='col-md-4'>

                                                </textarea>

                                                <button onClick={(e)=> { reply(e , collection.id);} } className=' col-md-4'>Reply</button>
                                                </> : ""
                                            }
                                            
                                        </div>


                                    </div>
                                </div>
                                )
                            }
                            
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;