var db = require('../config/connection')

var collection = require('../config/collections')
const collections = require('../config/collections')


module.exports = {
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
        try {
          

                var loginStatus = false
                let response = {}
    
                await db.get().collection('panel').findOne({ Email: adminData.Email }).then((admin) => {
    
    
                    if (admin) {
    
                        if (admin.Password == adminData.Password) {
                            console.log(adminData.Password);
                            console.log("login success");
                            response.admin = admin
                            response.status = true
                            resolve(response)
                        } else {
                            console.log("login failed");
                            resolve({ status: false })
    
                        }
    
                    } else {
                        console.log("login failedd");
                        resolve({ status: false })
                    }
                })
    
    
    
      
            
        } catch (error) {
            reject(error)
        }

    })

    }

}