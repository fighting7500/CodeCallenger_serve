/**
 * @Author: 17197
 * @Date: 2024-05-02 21:54:06
 * @Description: getIPLocation.js
 * @Version: 1.0
 * @Last Modified time : 2024-05-02 21:54:06
 **/
const axios = require('axios');

const Signature = `AppCode/${process.env.BAIDU_APP_CODE}`;
// 配置请求头
const request = axios.create({
	baseURL: 'https://ipaddqueryv2.api.bdymkt.com/ip/query-v2',
	timeout: 5000, // 请求超时时间
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
		"X-Bce-Signature": Signature,
	},
})

// 获取IP地址
const getIPLocation = async (ip) => {
	const res = await request({
		method: 'post',
		params: {
			ip: ip
		}
	})
	if (!res) {
		console.log('获取IP归属地失败');
		return null;
	}
	if (res.data.code !== 200) {
		console.log('获取IP归属地失败');
		return null;
	}
	const city = res.data.data.city.slice(0, -1);
	const province = res.data.data.province.slice(0, -1);
	return `${province}·${city}`;
}

module.exports = {
	getIPLocation
}
