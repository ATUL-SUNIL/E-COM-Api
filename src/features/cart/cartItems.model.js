import UserModel from "../user/user.model.js";
export default class cartItemModel{
    constructor(productId,userId,quantity,cartId){
        this.productId=productId;
        this.userId=userId;
        this.quantity=quantity;
        this.cartId=cartId;
    }

    // static add(productId,userId,quantity){
    //     const user = UserModel.getAll().find((u) => u.id == userId);
    //      const cartId=cartItems.length+1;
    //     const cartItem=new cartItemModel(
    //         productId,userId,quantity,cartId
    //     );

    //     cartItems.push(cartItem);
    // }

    // static get(userId){
    //     return cartItems.filter(
    //         (i)=>i.userId==userId
    //     );
    // }

    static delete(cartItemId,userId){
        const cartItemIndex=cartItems.findIndex(i=>i.id=cartItemId && i.userId==userId);
        if(cartItemIndex==-1){
            return "item not found"
        }
        else{
            
                    cartItems.splice(cartItemIndex,1);
                

        }
    }
}

var cartItems= [new cartItemModel(1,1,1,1),
    new cartItemModel(1,2,2,2),
];