const type = 'driver',
      username = "ben",
      email = "ben@live.hk",
      telephone_no =" 69381113",
      password = "123",
      vehicle_reg_no = "a12347",
      taxi_driver_id_no = "b4703";

/**
 * 
 * POST /api/user
 * 
 */
async function register(){
    try {
        const response = await axios.post('http://localhost:3100/api/user', 
            { type, username, email, telephone_no, password, vehicle_reg_no, taxi_driver_id_no }
        );
        return displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
};

/**
 * 
 * POST /api/user/login
 * 
 */
async function login(){
    try {
        const response = await axios.post('http://localhost:3100/api/user/login', { email, password });
        displayMessage(JSON.stringify(response.data, null, 4));
        access_token = response.data.access_token;
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
};

/**
 * 
 * POST /api/order
 * 
 */
async function getOrder(){
    try {
        const response = await axios.get('http://localhost:3100/api/order', 
            { 
                params: { status: 'new'},
                headers: { Authorization: 'Bearer ' + access_token }
            }
        );
        displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
}

async function acceptOrder(){

    const orderId = document.getElementById('orderNumber').value;

    try {
        const response = await axios.post('http://localhost:3100/api/order/' + orderId, 
            {
                type: 'accept'
            },
            { 
                headers: { Authorization: 'Bearer ' + access_token }
            }
        );
        displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
};

/**
 * 
 * Helper function
 * 
 */
const displayMessage = message => 
    document.getElementById('message').innerText = message;
