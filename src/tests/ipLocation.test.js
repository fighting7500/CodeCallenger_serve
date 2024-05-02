/**
 * @Author: 17197
 * @Date: 2024-05-02 21:58:29
 * @Description: ipLocation.test.js
 * @Version: 1.0
 * @Last Modified time : 2024-05-02 21:58:29
 **/
const {getIPLocation} = require('../utils/getIPLocation');

const ip = '171.43.131.69';

getIPLocation(ip).then(res => {
	console.log(res);
})
