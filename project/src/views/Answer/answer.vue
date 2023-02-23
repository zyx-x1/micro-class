<template>
	<div id="answer">
		<div class="model-error" v-if="!modelStatus">
			AI模型出错！请稍后再试!
			<br>
			正在检查服务器 <span>{{ dynamicDot }}</span>
		</div>
		<div class="container" v-else>

			<div class="tips" v-if="!isTipsClose">
				<div class="tips-content">
					在输入框中输入问题提交后，智能AI会根据您的问题进行回答。
					<br />
					可在下拉框中切换AI模型。
					<br />
					当前AI回复长度限制为{{ MAX_TOKENS_SIZE }}。
				</div>
				<div class="tips-close">
					<el-checkbox v-model="isNoPrompts" label="不再提示"></el-checkbox>
					<i class="el-icon-close" @click="closeTips()"></i>
				</div>
			</div>
			<div class="main">
				<div class="in">
					<el-input placeholder="请输入内容" v-model="searchTxt" class="input-with-select"
						@keydown.enter.native="submitProblem()">
						<el-select class="model-select" v-model="currentModel" slot="prepend" placeholder="请选择AI模型"
							:title="currentModel">
							<el-option v-for="(item, index) in modelList" :key="index" :label="item.id" :value="item.id"></el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-position" @click="submitProblem()"></el-button>
					</el-input>
				</div>
				<div class="prompts" ref="prompts">
					<div class="prompt" v-for="(item, index) in prompts" :key="index" :style="{
						'background': item.identity == 'USER' ? '#fff' : 'rgba(64, 158, 255,0.1)'
					}">
						<div class="prompt-avatar">
							<img :src="$store.state.loginCredentials.avatar" v-show="item.identity == 'USER'"
								style="border-radius: 50%;" alt="" srcset="">
							<img :src="aiAvatar" v-show="item.identity == 'AI'" alt="" srcset="">
						</div>
						<div class="prompt-content" v-html="item.content"></div>
					</div>
					<div v-show="isAILoad" class="prompt-load" style="background: rgba(64, 158, 255,0.1)">
						<div class="prompt-avatar">
							<img :src="aiAvatar" alt="" srcset="">
						</div>
						<div class="prompt-content">
							<i class="el-icon-loading"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
  
<script>
import aiAvatar from "../../../static/images/ai_avatar.png"
export default {
	data() {
		return {
			baseUrl: this.$store.state.baseUrl,
			MAX_TOKENS_SIZE: 500,
			dynamicDot: ".",
			modelList: [],
			modelStatus: true,
			isTipsClose: false,
			isNoPrompts: false,
			searchTxt: "",
			currentModel: "",
			prompts: [],
			aiAvatar: aiAvatar,
			isAILoad: false
		};
	},
	methods: {
		async getModelList() {
			let res = await this.axios.get('https://api.openai.com/v1/models', {
				params: {},
				headers: {
					"Authorization": "Bearer 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"
				}
			})
			if (res.status == 200) {
				this.modelList = res.data.data
				this.currentModel = 'text-davinci-003'
				this.modelStatus = true
			} else {
				this.$message.error("模型获取出错！请联系管理员后重试！")
				this.modelStatus = false
			}
		},
		closeTips() {
			this.isTipsClose = true
			console.log(`isNoPrompts`, this.isNoPrompts);
			if (this.isNoPrompts) {
				localStorage.setItem("ANSWER_TIPS_STATUS", 1)
			}
		},
		checkTipsClose() {
			let closeStatus = localStorage.getItem("ANSWER_TIPS_STATUS")
			this.isTipsClose = !!closeStatus
			console.log(`closeStatus`, !!closeStatus);
		},
		async submitProblem() {
			let search_txt = this.searchTxt
			if (this.isAILoad) {
				this.$message.error("请等待AI回答完上一个问题。")
				return
			}
			this.searchTxt = ''
			this.prompts.push(
				{
					content: search_txt,
					identity: "USER"
				}
			)
			this.isAILoad = true
			this.$nextTick(() => {
				this.$refs.prompts.scrollTop = this.$refs.prompts.scrollHeight
			})
			this.searchTxt = ''
			let res = await this.axios.post('https://api.openai.com/v1/completions', {
				"model": this.currentModel,
				"prompt": search_txt,
				"max_tokens": this.MAX_TOKENS_SIZE,
				"temperature": 0

			}, {
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer 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"
				}
			})
			this.isAILoad = false
			this.prompts.push(
				{
					content: res.data.choices[0].text,
					identity: "AI"
				}
			)

		},
		init() {
			this.getModelList()
			this.checkTipsClose()
		}
	},
	mounted() {
		this.init()
		setInterval(() => {
			this.dynamicDot = this.dynamicDot + '.'
			if (this.dynamicDot.length == 5) {
				this.dynamicDot = "."
			}
		}, 500)
	},
};
</script>
  
<style lang="less" scoped>
*::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 10px;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 1px;
}

#answer {
	background-color: rgba(0, 0, 0, 0.1);
	width: 100%;
	height: calc(100% - 200px);
	padding: 100px 0 60px;

	.model-error {
		font-size: 30px;
		line-height: 60px;
		margin-top: 20%;
		user-select: none;
	}

	.container {
		margin: 0 auto;
		padding: 20px 20px 30px 20px;
		width: 1200px;
		height: calc(100vh - 210px);
		background-color: #fff;
		box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.1);

		.tips {
			width: 90%;
			margin: 0 auto;
			border-radius: 10px;
			background-color: rgba(0, 0, 0, 0.1);
			text-align: left;
			padding: 10px;
			line-height: 1.5;
			font-size: 12px;
			position: relative;

			.tips-close {
				position: absolute;
				right: 15px;
				top: 5px;

				i {
					margin-left: 10px;
					font-size: 15px;
					cursor: pointer;
					transition: .5s;

					&:hover {
						color: #F56C6C;
					}
				}
			}
		}

		.main {
			.in {
				margin: 20px 0;

				.model-select {
					width: 200px;
				}

				.el-button {
					width: 100px;
				}
			}

			.prompts {
				max-height: calc(100vh - 350px);
				overflow-y: auto;



				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background-color: skyblue;
					background-image: -webkit-linear-gradient(45deg,
							rgba(255, 255, 255, 0.2) 25%,
							transparent 25%,
							transparent 50%,
							rgba(255, 255, 255, 0.2) 50%,
							rgba(255, 255, 255, 0.2) 75%,
							transparent 75%,
							transparent);
				}

				&::-webkit-scrollbar-track {
					box-shadow: inset 0 0 5px rgb(144, 187, 235);
					background: #ededed;
					border-radius: 10px;
				}

				.prompt,
				.prompt-load {
					display: flex;
					padding: 30px;
					text-align: left;
					border-radius: 10px;
					.prompt-avatar {
						width: 100px;

						img {
							width: 50px;
							height: 50px;
						}
					}

					.prompt-content {
						width: calc(100% - 100px);
						line-height: 2;
						word-wrap: break-word;
					}
				}
			}
		}
	}
}
</style>
  