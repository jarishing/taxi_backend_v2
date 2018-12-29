const type = 'driver',
      username = "ben",
      email = "ben@live.hk",
      telephone_no =" 69381113",
      password = "123",
      vehicle_reg_no = "a12347",
      taxi_driver_id_photo = "b4703";

/**
 * 
 * POST /api/user
 * 
 */
async function register(){
    try {
        const response = await axios.post('http://localhost:3100/api/user', 
            { type, username, email, telephone_no, password, vehicle_reg_no, taxi_driver_id_photo }
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
        const response = await axios.post('http://localhost:3100/api/user/login', { telephone_no, password });
        displayMessage(JSON.stringify(response.data, null, 4));
        access_token = response.data.access_token;
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
};

async function loginOther(){
    try {
        const response = await axios.post('http://localhost:3100/api/user/login', { email:'john@john.hk', password: '456' });
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

async function makeOrder(){
    try {
        const response = await axios.post('http://localhost:3100/api/order', 
            {
                origin: "東海大廈", destination: "仁賢大廈",
                criteria: {
                    taxiType: 'green', 
                    discount: 100,
                    tunnel: 'any',
                    passenger: 5
                }
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
}


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

async function getOrdererOrder(){
    try {
        const response = await axios.get('http://localhost:3100/api/order', 
            { 
                params: { status: 'all', identity: 'orderer'},
                headers: { Authorization: 'Bearer ' + access_token }
            }
        );
        displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
}

async function getDriverOrder(){
    try {
        const response = await axios.get('http://localhost:3100/api/order', 
            { 
                params: { status: 'all'},
                headers: { Authorization: 'Bearer ' + access_token }
            }
        );
        displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
}


/**
 * 
 * POST /api/order/:orderId
 * 
 */
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

async function releaseOrder(){

    const orderId = document.getElementById('orderNumber').value;

    try {
        const response = await axios.post('http://localhost:3100/api/order/' + orderId, 
            {
                type: 'release'
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
 * GET /api/user
 * 
 */
async function list(){
    
    try {
        const response = await axios.get('http://localhost:3100/api/user/',
            { 
                headers: { Authorization: 'Bearer ' + access_token }
            }
        );
        displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
}


/**
 * 
 * Socket
 * 
 */
const socket = io("http://localhost:3100");
let socketInfo = {};
socket.on("connect", function () {
    console.log('has connected');
    socketInfo.socketId = this.id;
});

socket.on('action', data => 
                console.log(data));

function whatIsMe(){
    socket.emit('what_is_me', access_token );
};

function renewLocation(){
    const position = { "lat": 22.334518, "lng": 114.157452};
    socket.emit('renew_location', position );
};




/**
 * 
 * Helper function
 * 
 */
const displayMessage = message => 
    document.getElementById('message').innerText = message;
