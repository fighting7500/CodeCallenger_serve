/**
 * @Author: 17197
 * @Date: 2024/4/4
 * @Description: adminController.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/4
 **/
const userAdminModel = require('../../models/admin/adminModules');
const userModel = require('../../models/userModel');
const bcryptUtils = require('../../utils/bcryptUtils');


// 获取用户列表
exports.getUserList = async (req, res) => {
	try {
		const {page, limit, id, phone, role} = req.query;
		const result = await userAdminModel.queryUserList(page, limit, id, phone, role);
		result.Rows.forEach(item => {
			delete item.password;
			item.avatar = process.env.BASE_URL + item.avatar;
		})
		res.sendRes(result, 200, 'success');
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 新增用户
exports.addUser = async (req, res) => {
	try {
		const {username, password, mobile, role, email} = req.body;
		// 判断用户,手机号是否存在
		const user = await userModel.query(1, username)
		const mobileUser = await userModel.query(2, mobile)
		if (user) {
			return res.sendRes(null, 400, '用户名已存在');
		}
		if (mobileUser) {
			return res.sendRes(null, 400, '手机号已存在');
		}
		// 密码加密
		const hash = await bcryptUtils.hashPassword(password);
		const result = await userAdminModel.addUser(username, hash, mobile, role, email);
		if (result.affectedRows) {
			res.sendRes(null, 200, 'success');
		} else {
			res.sendRes(null, 400, '新增用户失败');
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 删除用户
exports.deleteUser = async (req, res) => {
	try {
		const {id} = req.query;
		const result = await userAdminModel.deleteUser(id);
		if (result.affectedRows) {
			console.log('删除用户成功, id:', id);
			res.sendRes(null, 200, 'success');
		} else {
			res.sendRes(null, 400, '删除用户失败');
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 修改用户
exports.updateUser = async (req, res) => {
	try {
		// 判断是修改密码还是其他信息
		const {id, password, ...rest} = req.body;
		if (password) {
			// 修改密码
			console.log('修改密码:', id, password)
			const hash = await bcryptUtils.hashPassword(password);
			const result = await userModel.resetPassword(id, hash);
			if (result) {
				throw new Error(result);
			}
			res.sendRes(null, 200, 'success');
		} else {
			// 修改其他信息
			// 展开rest对象
			const result = await userAdminModel.updateUser(id, rest);
			if (result.affectedRows) {
				res.sendRes(null, 200, 'success');
			} else {
				res.sendRes(null, 400, '修改用户失败');
			}
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 发布/取消发布题目
exports.updateProblemStatus = async (req, res) => {
	try {
		const {id, status} = req.query;
		const result = await userAdminModel.updateProblemStatus(id, status);
		if (result.affectedRows) {
			console.log('发布/取消发布题目成功');
			res.sendRes(null, 200, 'success');
		} else {
			res.sendRes(null, 400, '发布/取消发布题目失败');
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 删除题目
exports.deleteProblem = async (req, res) => {
	try {
		const {id} = req.query;
		const result = await userAdminModel.deleteProblem(id);
		if (result.affectedRows) {
			console.log('删除题目成功');
			res.sendRes(null, 200, 'success');
		} else {
			res.sendRes(null, 400, '删除题目失败');
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 新增题目
exports.addProblem = async (req, res) => {
	try {
		const {Form, SampleInputs, SampleOutputs, SampleRemarks, TestInputs, TestExpectedOutputs} = req.body;
		const result = await userAdminModel.addProblem(JSON.parse(Form), SampleInputs, SampleOutputs, SampleRemarks, TestInputs, TestExpectedOutputs);
		if (result.affectedRows) {
			console.log('新增题目成功');
			res.sendRes(null, 200, 'success');
		} else {
			res.sendRes(null, 400, '新增题目失败');
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

// 审核文章
exports.updateArticleStatus = async (req, res) => {
	try {
		const {id, status} = req.query;
		const result = await userAdminModel.updateArticleStatus(id, status);
		if (result.affectedRows) {
			console.log('审核文章成功');
			res.sendRes(null, 200, 'success');
		} else {
			res.sendRes(null, 400, '审核文章失败');
		}
	} catch (error) {
		console.error(error);
		res.sendRes(null, 500, '服务器错误');
	}
}
