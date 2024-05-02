const bcryptUtils = require('../utils/bcryptUtils');
const userModel = require('../models/userModel');
const Client = require('../utils/client').default;
const redis = require('../config/redisConfig');
const jwt = require('jsonwebtoken');
const pointsModule = require("../models/pointsModules");
const pointsRules = require("../config/points");
// 引入jsonwebtoken, 用于生成token


// 查询用户名，邮箱，手机号是否存在
exports.checkUser = async (req, res) => {
	console.log('查询');
	try {
		const data = req.body;
		console.log(data.type, data.value);
		const user = await userModel.query(data.type, data.value);	// type: 1-用户名, 2-手机号, 3-邮箱
		if (user) {
			console.log('已存在');
			return res.sendRes(null, 200, `该${data.type === 1 ? '用户名' : data.type === 2 ? '手机号' : '邮箱'}已被注册`);
		}
		console.log('不存在');
		res.sendRes(null, 400, 'success');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}
// 创建用户
exports.register = async (req, res) => {
	console.log('注册');
	try {
		const data = req.body;
		// 校验验证码
		const captcha = await redis.verifyCaptcha(data.UserMobile, data.Code);
		if (!captcha) {
			console.log('验证码错误');
			return res.sendRes(null, 400, '验证码错误');
		}
		// 创建新用户
		data.Password = await bcryptUtils.hashPassword(data.Password);
		const result = await userModel.createUser(data);
		if (result) {
			throw new Error(result);
		}
		res.sendRes(null, 200, '注册成功');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 滑块验证
exports.verifyCaptcha = async (req, res) => {
	console.log('验证验证码');
	try {
		const data = req.body;
		const result = await Client.main([data.CaptchaVerifyParam]);
		console.log('result:', result)
		if (!result) {
			console.log('验证错误');
			return res.sendRes(null, 400, '验证失败,请重试');
		}
		console.log('验证通过');
		res.sendRes(null, 200, '验证通过');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 发送验证码
exports.verifyCode = async (req, res) => {
	console.log('发送验证码');
	try {
		const UserMobile = req.body.UserMobile;
		console.log(UserMobile);
		// 生成验证码
		const captcha = Math.floor(100000 + Math.random() * 900000);
		// 保存验证码
		await redis.saveCaptcha(UserMobile, captcha);
		// 发送验证码
		const resp = await Client.sendCode([UserMobile, captcha]);
		if (resp.statusCode == 200 && resp.body.code == 'OK') {
			console.log('发送验证码成功');
			return res.sendRes(null, 200, '发送验证码成功');
		}
		console.log('发送验证码失败');
		return res.sendRes(null, 400, '验证码发送失败,请重试');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 用户名/邮箱/手机号登录
exports.login = async (req, res) => {
	// 实现登录逻辑
	console.log('登录');
	try {
		const data = req.body;
		let user = null;
		// 判断是验证码登录还是账号登录
		if (data.IsCode === 2) {
			console.log('验证码登录');
			// 校验验证码
			const captcha = await redis.verifyCaptcha(data.UserMobile, data.Code);
			if (!captcha) {
				console.log('验证码错误');
				return res.sendRes(null, 400, '验证码错误');
			}
			// 查询用户
			user = await userModel.query('2', data.UserMobile);
			if (!user) {
				console.log('用户不存在');
				return res.sendRes(null, 400, '用户不存在');
			}
		} else {
			// 判断是哪种登录方式
			// 通过正则判断account是手机号，邮箱还是用户名
			if (/^1[3456789]\d{9}$/.test(data.Account)) {
				user = await userModel.query('2', data.Account);
			} else if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(data.Account)) {
				user = await userModel.query('3', data.Account);
			} else {
				user = await userModel.query('1', data.Account);
			}
			if (!user) {
				console.log('用户不存在');
				return res.sendRes(null, 400, '用户不存在');
			}
			const isPasswordMatch = await bcryptUtils.comparePassword(data.Password, user.password);
			if (!isPasswordMatch) {
				console.log('密码错误');
				return res.sendRes(null, 400, '密码错误');
			}
		}
		// 调用方法判断登录记录
		const recordInfo = await checkLoginRecord(user.id);
		const {password, ...userInfo} = user;
		// avatar拼接上服务器地址
		userInfo.avatar = process.env.BASE_URL + userInfo.avatar;
		const accessToken = generateToken(userInfo);
		setCookie(res, 'access_token', accessToken, false)
		const refreshToken = generateToken(userInfo, "7d");
		setCookie(res, 'refresh_token', refreshToken, true)
		console.log('登录成功');
		res.sendRes({...userInfo, recordInfo}, 200, '登录成功');
		user = null;
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 获取用户信息
exports.getUserInfo = async (req, res) => {
	console.log('获取用户信息');
	try {
		const user = req.user;
		const {id, ...userInfo} = user;
		if (!id) {
			console.log('用户不存在');
			return res.sendRes(null, 400, '');
		}
		// 通过id查询用户信息
		const result = await userModel.query('4', id);
		// 获取用户积分
		if (!result) {
			console.log('用户不存在');
			return res.sendRes(null, 400, '用户不存在');
		}
		const recordInfo = await checkLoginRecord(id, true);
		result.points = await pointsModule.getPoints(id);
		console.log('获取用户信息成功');
		const {password, ...data} = result;
		data.avatar = process.env.BASE_URL + data.avatar;
		res.sendRes({...data, recordInfo}, 200, 'success');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}


// 刷新token
exports.refreshToken = async (req, res) => {
	console.log('刷新token');
	try {
		const refreshToken = req.signedCookies.refresh_token;
		if (!refreshToken) {
			console.log('refreshToken不存在');
			return res.sendRes(null, 405, '用户信息登录超时，请重新登录');
		}
		console.log('获取到refreshToken')
		jwt.verify(refreshToken, 'secret', (err, decoded) => {
			if (err) {
				console.log('refreshToken已过期');
				return res.sendRes(null, 405, '用户信息登录超时，请重新登录');
			}
			const {exp, iat, ...userInfo} = decoded;
			console.log('刷新令牌的userInfo', userInfo)
			const accessToken = generateToken(userInfo);
			const refreshToken = generateToken(userInfo, "7d");
			setCookie(res, 'access_token', accessToken, false)
			setCookie(res, 'refresh_token', refreshToken, true)
			res.sendRes(null, 200, 'success');
		});
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 退出登录
exports.logout = async (req, res) => {
	console.log('退出登录');
	try {
		res.clearCookie('access_token', {domain: 'localhost'});
		res.clearCookie('refresh_token', {domain: 'localhost'});
		res.sendRes(null, 200, '退出登录成功');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 重置密码
exports.resetPassword = async (req, res) => {
	console.log('重置密码');
	try {
		const data = req.body;
		// 查询手机号是否存在
		const user = await userModel.query('2', data.UserMobile);
		if (!user) {
			console.log('用户不存在');
			return res.sendRes(null, 400, '用户不存在');
		}
		// 校验验证码
		const captcha = await redis.verifyCaptcha(data.UserMobile, data.Code);
		if (!captcha) {
			console.log('验证码错误');
			return res.sendRes(null, 400, '验证码错误');
		}
		// 重置密码
		const password = await bcryptUtils.hashPassword(data.Password);
		const result = await userModel.resetPassword(user.id, password);
		if (result) {
			throw new Error(result);
		}
		res.sendRes(null, 200, 'success');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 生成token
function generateToken(data, time = '1h') {
	return jwt.sign(data, 'secret', {
		expiresIn: time
	});
}

// 设置cookie
function setCookie(res, name, token, httpOnly = true, maxAge = 24 * 60 * 60 * 1000) {
	res.cookie(name, token, {
		httpOnly: httpOnly,
		maxAge: maxAge,
		signed: true, // 签名cookie, 防止篡改
	})
}


// 判断登录记录
async function checkLoginRecord(user_id, isGet = false) {
	// 查询今日登录信息
	let recordInfo = [];
	const todayLogin = await userModel.queryTodayLogin(user_id);
	if (todayLogin) {
		// 如果今日已登录，直接插入登录信息，连续登录天数为查询到的连续登录天数
		const loginDays = todayLogin["consecutive_days"];
		// 只有isGet为false时，才进行插入登录信息
		if (!isGet) {
			await userModel.insertLoginRecord(user_id, loginDays);
		}
	} else {
		// 如果今日未登录，查询昨天是否登录过
		// 首次登录，增加积分
		await pointsModule.addPoints(user_id, 'dailyLogin');
		recordInfo.push(pointsRules.dailyLogin);
		const yesterdayLogin = await userModel.queryYesterdayLogin(user_id);
		if (yesterdayLogin) {
			// 根据昨天登录情况插入登录信息（昨天未登录，连续登录天数为1，昨天登录过，连续登录天数为查询到的连续登录天数+1）
			await userModel.insertLoginRecord(user_id, yesterdayLogin["consecutive_days"] + 1);
			if ([3, 7, 15, 30].includes(yesterdayLogin["consecutive_days"] + 1)) {
				await pointsModule.addPoints(user_id, 'continuousLogin', yesterdayLogin["consecutive_days"] + 1);
				let days = 0
				switch (yesterdayLogin["consecutive_days"] + 1) {
					case 3:
						days = 0;
						break;
					case 7:
						days = 1;
						break;
					case 15:
						days = 2;
						break;
					case 30:
						days = 3;
						break;
				}
				recordInfo.push({
					points: pointsRules.continuousLogin.points[days],
					description: pointsRules.continuousLogin.description
				});
			}
		} else {
			await userModel.insertLoginRecord(user_id, 1);
		}
	}
	return recordInfo;
}
