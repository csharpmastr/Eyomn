const {v4: uuid} = require("uuid")
const { inventoryCollection } = require("../Config/FirebaseConfig")


const addProduct = async(productDetails) =>{
    try{
        const productId = uuid();

        const inventoryRef = inventoryCollection;
        const productRef = inventoryRef.doc(productId)

    }
} 