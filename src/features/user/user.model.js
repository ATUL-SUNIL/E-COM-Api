export default class UserModel{
    constructor(name,email,password,type){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        this.id=users.length+1;
    }
    static signUp(name,email,password,type){
        const newUser=new UserModel(name,email,password,type);
        users.push(newUser);
        return newUser;
    }
    static signIn(email,password){
        const user=users.find((u)=>u.email==email && u.password==password);
        return user;
        }

        static getAll(){
            return users;
        }
}



let users=[{
    name:"Seller User",
    email:"seller@ecom.com",
    password:"password1",
    type:"seller",
    id:1,
},
{
    name:"Customer User",
    email:"seller@ecom.com",
    password:"password2",
    type:"custom er",
    id:2,
},
];