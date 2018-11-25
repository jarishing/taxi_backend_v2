const type = 'user',
      username = "ken",
      email = "ken@live.hk",
      telephone_no =" 69381113",
      password = "123";

let access_token = null;

/**
 * 
 * POST /api/user
 * 
 */
async function register(){
    try {
        const response = await axios.post('http://localhost:3100/api/user', { type, username, email, telephone_no, password});
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

// const start = '東海大廈', end = '青衣城';

/**
 * 
 * GET /api/place
 * 
 */
async function findPlace(place){
    try {
        const response = await axios.get('http://localhost:3100/api/place',     
            { 
                params: { keyword: place },
                headers: { Authorization: 'Bearer ' + access_token }
            }
        );
        displayMessage(JSON.stringify(response.data, null, 4));
    } catch (error){
        console.error(error.data);
        return displayMessage(JSON.stringify(error, null, 4));
    };
};

const start = { "lat": 22.32338, "lng": 114.168784 },
      end = { "lat": 22.3592713, "lng": 114.1082266 };

/**
 * 
 * GET /api/place/address
 * 
 */
async function findAddress(){
    try {
        const response = await axios.get('http://localhost:3100/api/place/address',     
            { 
                params: start,
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
 * POST /api/place/path
 * 
 */
async function path(){
    try {

        const response = await axios.post('http://localhost:3100/api/place/path', 
            {
                origin: start, destination: end,
                taxiType: 'red', discount: 100,
                tunnel: 'any'
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
 * POST /api/order
 * 
 */
async function createOrder(){
    try {
        const response = await axios.post('http://localhost:3100/api/order', 
            {
                origin: start, destination: end,
                criteria: {
                    taxiType: 'red', 
                    discount: 100,
                    tunnel: 'any',
                    passenger: 4
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
 * Helper function
 * 
 */
const displayMessage = message => 
    document.getElementById('message').innerText = message;

const getMyLatLng = _ => 
    new Promise (resolve => {
        navigator.geolocation.getCurrentPosition(position=> 
            resolve(position)
        )
    });
        