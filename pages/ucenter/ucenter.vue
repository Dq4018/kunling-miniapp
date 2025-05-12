<template>
	<view class="center">
		<uni-sign-in ref="signIn"></uni-sign-in>
		<view class="app-title">
			<text class="title-text">坤灵知识产权管理小程序</text>
		</view>
			
		<!-- 用户信息区域 -->
		<view class="user-section">
			<view class="user-info" @click.capture="toUserInfo">
				<cloud-image width="120rpx" height="120rpx" v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"></cloud-image>
			<view v-else class="defaultAvatarUrl">
					<image src="/static/uni-load-state/logo.png" mode="widthFix" class="logo-avatar" />
				</view>
				
				<view class="user-detail">
					<text class="user-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
					<text class="user-name" v-else>{{$t('mine.notLogged')}}</text>
				</view>
			</view>
			
			<!-- 登录注册按钮区域 -->
			<view class="auth-buttons" v-if="!hasLogin">
				<button class="auth-btn login" @click="signIn">登录</button>
				<button class="auth-btn register" @click="toRegister">注册</button>
			</view>
			<view class="user-actions" v-else>
				<button class="action-btn" @click="toUserInfo">个人信息</button>
				<button class="action-btn" @click="signOut">退出登录</button>
			</view>
		</view>

		<!-- 功能区域 -->
		<view class="function-section">
			<view class="section-title">快捷功能</view>
			<uni-grid class="grid" :column="3" :showBorder="false" :square="true">
				<uni-grid-item class="item" v-for="(item,index) in gridList" :key="index">
					<uni-icons class="icon" color="#007AFF" :type="item.icon" size="26"></uni-icons>
					<text class="text">{{item.text}}</text>
				</uni-grid-item>
			</uni-grid>
		</view>

		<!-- 列表区域 -->
		<view class="list-section">
			<view class="section-title">更多服务</view>
		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :rightText="item.rightText" :key="i"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true"
				:extraIcon="{type:item.icon,color:'#999'}">
				<template v-slot:footer>
					<view v-if="item.showBadge" class="item-footer">
						<text class="item-footer-text">{{item.rightText}}</text>
						<view class="item-footer-badge"></view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		</view>
	</view>
</template>

<script>
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		// #ifdef APP
		onBackPress({from}) {
			if(from=='backbutton'){
				this.$nextTick(function(){
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				gridList: [{
						"text": this.$t('mine.showText'),
						"icon": "chat"
					},
					{
						"text": this.$t('mine.showText'),
						"icon": "cloud-upload"
					},
					{
						"text": this.$t('mine.showText'),
						"icon": "contact"
					},
					{
						"text": this.$t('mine.showText'),
						"icon": "download"
					}
				],
				ucenterList: [
					[
						// #ifdef APP
						{
							"title": this.$t('mine.signInByAd'),
							"event": 'signInByAd',
							"icon": "compose"
						},
						// #endif
						{
							"title": this.$t('mine.signIn'),
							"event": 'signIn',
							"icon": "compose"
						},
						// #ifdef APP-PLUS
						{
							"title": this.$t('mine.toEvaluate'),
							"event": 'gotoMarket',
							"icon": "star"
						},
						//#endif
						{
							"title":this.$t('mine.readArticles'),
							"to": '/pages/ucenter/read-news-log/read-news-log',
							"icon": "flag"
						},
						{
							"title": this.$t('mine.myScore'),
							"to": '',
							"event": 'getScore',
							"icon": "paperplane"
						}
						// #ifdef APP
						, {
							"title": this.$t('mine.invite'),
							"event": 'share',
							"icon": "redo"
						}
						// #endif
					],
					[{
						"title": this.$t('mine.feedback'),
						"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						"icon": "help"
					}, {
						"title": this.$t('mine.settings'),
						"to": '/pages/ucenter/settings/settings',
						"icon": "gear"
					}],
					// #ifdef APP
					[{
						"title": this.$t('mine.about'),
						"to": '/pages/ucenter/about/about',
						"icon": "info"
					}]
					// #endif
				],
				listStyles: {
					"height": "150rpx", // 边框高度
					"width": "150rpx", // 边框宽度
					"border": { // 如果为 Boolean 值，可以控制边框显示与否
						"color": "#eee", // 边框颜色
						"width": "1px", // 边框宽度
						"style": "solid", // 边框样式
						"radius": "100%" // 边框圆角，支持百分比
					}
				},
				userInfo: {},
				roleInfo: {},
				menuList: [],
				allMenus: {
					admin: [
						{ name: '用户管理', url: '/pages/admin/user', icon: 'icon-yonghu' },
						{ name: '角色管理', url: '/pages/admin/role', icon: 'icon-jiaose' },
						{ name: '系统设置', url: '/pages/admin/settings', icon: 'icon-shezhi' }
					],
					user: [
						{ name: '我的订单', url: '/pages/order/list', icon: 'icon-dingdan' },
						{ name: '我的收藏', url: '/pages/collect/list', icon: 'icon-shoucang' }
					]
				}
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title:this.$t('mine.checkUpdate'),// this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			//#endif
			this.getUserInfo();
		},
		onShow() {
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
			// #ifdef APP-PLUS
			appVersion() {
				return getApp().appVersion
			},
			// #endif
			appConfig() {
				return getApp().globalData.config
			}
		},
		methods: {
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			signIn() { //普通签到
				this.$refs.signIn.open()
			},
			signInByAd(){ //看激励视频广告签到
				this.$refs.signIn.showRewardedVideoAd()
			},
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
			async checkVersion() {
				let res = await callCheckVersion()
				console.log(res);
				if (res.result.code > 0) {
					checkUpdate()
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				})
			},
			tapGrid(index) {
				uni.showToast({
					// title: '你点击了，第' + (index + 1) + '个',
					title: this.$t('mine.clicked') + " " + (index + 1) ,
					icon: 'none'
				});
			},
			/**
			 * 去应用市场评分
			 */
			gotoMarket() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "ios") {
					// 这里填写appstore应用id
					let appstoreid = this.appConfig.marketId.ios; // 'id1417078253';
					console.log({appstoreid});
					plus.runtime.openURL("itms-apps://" + 'itunes.apple.com/cn/app/wechat/' + appstoreid + '?mt=8',err=>{
						console.log('plus.runtime.openURL err:' + JSON.stringify(err));
					});
				}
				if (uni.getSystemInfoSync().platform == "android") {
					var Uri = plus.android.importClass("android.net.Uri");
					var uri = Uri.parse("market://details?id=" + this.appConfig.marketId.android);
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent(Intent.ACTION_VIEW, uri);
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				}
				// #endif
			},
			/**
			 * 获取积分信息
			 */
			getScore() {
				if (!this.userInfo) return uni.showToast({
					title: this.$t('mine.checkScore'),
					icon: 'none'
				});
				uni.showLoading({
					mask: true
				})
				db.collection("uni-id-scores")
					.where('"user_id" == $env.uid')
					.field('score,balance')
					.orderBy("create_date", "desc")
					.limit(1)
					.get()
					.then((res) => {
						console.log(res);
						const data = res.result.data[0];
						let msg = '';
						msg = data ? (this.$t('mine.currentScore')+ data.balance) : this.$t('mine.noScore');
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}).finally(()=>{
						uni.hideLoading()
					})
			},
			async share() {
				let {result} = await db.collection('uni-id-users').where("'_id' == $cloudEnv_uid").field('my_invite_code').get()
				let myInviteCode = result.data[0].my_invite_code
				if(!myInviteCode){
					return uni.showToast({
						title: '请检查uni-config-center中uni-id配置，是否已启用 autoSetInviteCode',
						icon: 'none'
					});
				}
				console.log({myInviteCode});
				let {
					appName,
					logo,
					company,
					slogan
				} = this.appConfig.about
				// #ifdef APP
				uniShare.show({
					content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.appConfig.h5.url +
							`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
						title: appName,
						summary: slogan,
						imageUrl: logo +
							'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
					},
					menus: [{
							"img": "/static/app/sharemenu/wechatfriend.png",
							"text": this.$t('common.wechatFriends'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneSession"
							}
						},
						{
							"img": "/static/app/sharemenu/wechatmoments.png",
							"text": this.$t('common.wechatBbs'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneTimeline"
							}
						},
						{
							"img": "/static/app/sharemenu/weibo.png",
							"text": this.$t('common.weibo'),
							"share": {
								"provider": "sinaweibo"
							}
						},
						{
							"img": "/static/app/sharemenu/qq.png",
							"text": "QQ",
							"share": {
								"provider": "qq"
							}
						},
						{
							"img": "/static/app/sharemenu/copyurl.png",
							"text": this.$t('common.copy'),
							"share": "copyurl"
						},
						{
							"img": "/static/app/sharemenu/more.png",
							"text": this.$t('common.more'),
							"share": "shareSystem"
						}
					],
					cancelText: this.$t('common.cancelShare'),
				}, e => { //callback
					console.log(e);
				})
				// #endif
			},
			toRegister() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/register/register'
				})
			},
			signOut() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('uni_id_token');
							uni.removeStorageSync('uni_id_token_expired');
							uni.reLaunch({
								url: '/pages/ucenter/ucenter'
							});
						}
					}
				});
			},
			getUserInfo() {
				// 模拟后端返回
				// 实际开发中应通过接口获取
				this.userInfo = { nickname: '张三', avatar: '', role_id: 'admin' };
				this.roleInfo = { role_id: 'admin', role_name: '管理员', level: 2 };
				this.setMenuByRole();
			},
			setMenuByRole() {
				// 根据角色设置可见菜单
				this.menuList = this.allMenus[this.roleInfo.role_id] || this.allMenus['user'];
			},
			goTo(url) {
				uni.navigateTo({ url });
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/uni_modules/uni-scss/theme.scss';
@import '@/uni.scss';
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	page {
		background-color: $uni-bg-color;
	}
	/* #endif*/
	
	.app-title {
		width: 100%;
		height: 140rpx;
		background-color: $uni-primary;
		background-image: url('data:image/svg+xml;base64,PHN2ZyB0PSIxNjgxMjM0NTY3ODkwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ5NzAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODk2IDUxMmMwIDIxMi4xNzctMTcxLjgyMyAzODQtMzg0IDM4NFMxMjggNzI0LjE3NyAxMjggNTEyIDI5OS44MjMgMTI4IDUxMiAxMjhzMzg0IDE3MS44MjMgMzg0IDM4NHogbS0zODQgMjU2YzE0MS4xNTIgMCAyNTYtMTE0Ljg0OCAyNTYtMjU2UzY1My4xNTIgMjU2IDUxMiAyNTZzLTI1NiAxMTQuODQ4LTI1NiAyNTYgMTE0Ljg0OCAyNTYgMjU2IDI1NnoiIGZpbGw9IiNmZmZmZmYiIHAtaWQ9IjQ5NzEiPjwvcGF0aD48L3N2Zz4=');
		background-repeat: no-repeat;
		background-position: 20rpx center;
		background-size: 60rpx 60rpx;
		justify-content: center;
		align-items: center;
		padding: 50rpx 0 10rpx 0;
		margin-top: 0;
		border-radius: 0 0 20rpx 20rpx;
		position: relative;
	}

	.title-text {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: bold;
		text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.2);
		letter-spacing: 4rpx;
		margin-left: 80rpx;
	}

	.user-section {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
	}

	.user-info {
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.user-detail {
		flex: none;
		margin-left: 0;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.user-name {
		font-size: 32rpx;
		color: $uni-main-color;
		font-weight: bold;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.auth-buttons, .user-actions {
		flex-direction: row;
		justify-content: center;
		margin-top: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid $uni-border-1;
		gap: 30rpx;
	}

	.auth-btn, .action-btn {
		width: 180rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 32rpx;
	}

	.auth-btn.login {
		background-color: $uni-primary;
		color: #FFFFFF;
	}

	.auth-btn.register {
		background-color: #FFFFFF;
		color: $uni-primary;
		border: 1rpx solid $uni-primary;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: $uni-main-color;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid $uni-border-1;
	}

	.function-section, .list-section {
		background-color: #FFFFFF;
		margin: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
		overflow: hidden;
	}

	.defaultAvatarUrl {
		width: 120rpx;
		height: 120rpx;
		background-color: $uni-primary;
		border-radius: 100%;
		justify-content: center;
		align-items: center;
	}

	.logo-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 32rpx;
		background: #fff;
		display: block;
		margin: 0 auto;
	}

	.grid {
		background-color: #FFFFFF;
	}

	.uni-grid .text {
		font-size: 16px;
		height: 25px;
		line-height: 25px;
		color: $uni-secondary-color;
	}

	.uni-grid .item ::v-deep .uni-grid-item__box {
		justify-content: center;
		align-items: center;
	}

	.center-list ::v-deep .uni-list--border:after {
		-webkit-transform: scaleY(0.2);
		transform: scaleY(0.2);
		margin-left: 80rpx;
	}

	.center-list ::v-deep .uni-list--border-top,
	.center-list ::v-deep .uni-list--border-bottom {
		display: none;
	}

	.item-footer {
		flex-direction: row;
		align-items: center;
	}

	.item-footer-text {
		color: $uni-secondary-color;
		font-size: 24rpx;
		padding-right: 10rpx;
	}

	.item-footer-badge {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: $uni-error;
	}
</style>
