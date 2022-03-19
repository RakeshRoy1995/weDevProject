export const userInfo = (value:any)=>{
    return {
        type: "USER_INFORMATION",
        value : value
    }
}


export const cartInfo = (value:any)=>{
    return {
        type: "CART_INFORMATION",
        value : value
    }
}