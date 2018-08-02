<template>
  <div>
    <Breadcrumb>
      <Breadcrumb-item href="/">首页</Breadcrumb-item>
      <Breadcrumb-item href="#">{{ consts.ALIASES[alias] }}</Breadcrumb-item>
      <Breadcrumb-item href="/articles/index">产品列表</Breadcrumb-item>
      <Breadcrumb-item>{{ id ? '编辑' : '新增' }}</Breadcrumb-item>
    </Breadcrumb>
    <div class="limit-width">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="标题" prop="title">
          <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
        </Form-item>
        <Form-item label="分类" prop="category_id">
          <Select v-model="formValidate.category_id" placeholder="请选择分类" clearable style="width: 220px;">
            <Option v-for="item in categories.categories.items" :value="item.id" :key="item.id">
              {{ item.title }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="图片 1" prop="picture">
          <Uploader key="0" v-if="id && !formValidate.picture1" ref="uploader1" @change="handleUploader1Change"></Uploader>
          <Uploader key="1" v-if="id && formValidate.picture1" ref="uploader1" v-model="formValidate.picture1"
                    @change="handleUploader1Change"></Uploader>
          <Uploader key="2" v-if="!id" ref="uploader1" @change="handleUploader1Change"></Uploader>
          <Input v-model="formValidate.picture1" style="display: none;"></Input>
          （尺寸：1150x647）
        </Form-item>
        <Form-item label="图片 2" prop="picture">
          <Uploader key="0" v-if="id && !formValidate.picture2" ref="uploader2" @change="handleUploader2Change"></Uploader>
          <Uploader key="1" v-if="id && formValidate.picture2" ref="uploader2" v-model="formValidate.picture2"
                    @change="handleUploader2Change"></Uploader>
          <Uploader key="2" v-if="!id" ref="uploader2" @change="handleUploader2Change"></Uploader>
          <Input v-model="formValidate.picture2" style="display: none;"></Input>
          （尺寸：1150x647）
        </Form-item>
        <Form-item label="价格" prop="price">
          <InputNumber :min="1" :max="100000" v-model="formValidate.price"></InputNumber>
          元
        </Form-item>
        <Form-item label="库存" prop="price">
          <InputNumber :min="1" :max="100000" v-model="formValidate.price"></InputNumber>
          件
        </Form-item>
        <Form-item label="采购地点" prop="purchase_address">
          <Input v-model="formValidate.purchase_address" placeholder="请输入标题"></Input>
        </Form-item>
        <Form-item label="商家电话" prop="seller_telephone">
          <Input v-model="formValidate.seller_telephone" placeholder="请输入标题"></Input>
        </Form-item>
        <Form-item label="详情" prop="content">
          <Editor ref="editor" v-model="formValidate.content" @change="handleEditorChange"></Editor>
          <Input v-model="formValidate.content" style="display: none;"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSave" class="margin-right-sm">保存</Button>
          <Button type="ghost" @click="$router.push(`/${prefix}/${alias}/articles/index`)">返回</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import Editor from '@/components/Editor'
  import Uploader from '@/components/Uploader'

  export default {
    name: 'form',
    async created () {
      this.prefix = this.$route.params.prefix
      this.alias = this.$route.params.alias
      this.id = this.$route.params.id
      await this.getCategoryItems()
      this.id && this.getDetails(this.id)
    },
    components: {
      Editor,
      Uploader
    },
    data () {
      return {
        consts,
        prefix: '',
        alias: '',
        id: '',
        formValidate: {
          title: '',
          content: '',
          category_id: '',
          picture: ''
        },
        ruleValidate: {
          title: [
            {
              required: true,
              message: '标题不能为空'
            },
            {
              max: 100,
              message: '标题不能多于 100 个字'
            }
          ],
          category_id: [
            {
              required: true,
              message: '请选择分类'
            }
          ],
          picture: [
            {
              required: true,
              message: '请上传封面'
            }
          ],
          content: [
            {
              required: true,
              message: '内容不能为空'
            },
            {
              max: 10000,
              message: '内容长度过长'
            }
          ]
        }
      }
    },
    methods: {
      getDetails (id) {
        return this.$store.dispatch('getArticle', { id })
      },
      getCategoryItems () {
        return this.$store.dispatch('getCategories', {
          query: {
            where: { alias: this.alias }
          }
        })
      },
      handleEditorChange (html) {
        this.formValidate.content = html
      },
      handleUploader1Change (file) {
        this.formValidate.picture1 = file ? file.id : ''
      },
      handleUploader2Change (file) {
        this.formValidate.picture2 = file ? file.id : ''
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'putArticle' : 'postArticle'

            await this.$store.dispatch(action, {
              id,
              body: { ...formValidate, alias }
            })

            this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
            !id && this.resetFields()
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.editor.html('')
        this.$refs.uploader.remove()
      }
    },
    computed: mapState([
      'articles',
      'categories'
    ]),
    watch: {
      'articles.article': {
        handler (newVal) {
          this.formValidate = newVal
          this.$refs.editor.html(newVal.content)
        }
      }
    }
  }
</script>
