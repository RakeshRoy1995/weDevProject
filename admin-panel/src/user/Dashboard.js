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
    <>

    </>
  );
}

export default Dashboard;