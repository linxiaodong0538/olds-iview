<template>
  <div>
    <div class="limit-width">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="标题" prop="title">
          <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
        </Form-item>
        <Form-item label="内容" prop="content">
          <Editor ref="editor" v-model="formValidate.content" @change="handleEditorChange"></Editor>
          <Input v-model="formValidate.content" style="display: none;"></Input>
        </Form-item>
        <Form-item label="分类" prop="category_id">
          <Categories :alias="alias" v-model="formValidate.category_id" @on-change="handleCategoryChange"></Categories>
        </Form-item>
        <Form-item label="封面" prop="picture">
          <Uploader
            ref="uploader"
            :has-default-file="!!id"
            v-model="formValidate.picture"
            @change="handleUploaderChange"
          />
        </Form-item>
        <Form-item class="save">
          <Button type="primary" @click="handleSave" class="margin-right-sm">保存</Button>
          <Button type="ghost" @click="$router.push(`${routePrefix}/articles/index`)">返回</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import Editor from '@/components/Editor'
  import Uploader from '@/components/Uploader'
  import Categories from '@/components/Categories'

  export default {
    name: 'form',
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias
      this.id = this.$route.params.id
      await this.getCategoryItems()
      this.id && this.getDetails(this.id)
    },
    components: {
      Editor,
      Uploader,
      Categories
    },
    data () {
      return {
        consts,
        routePrefix: '',
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
              max: 50000,
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
      handleUploaderChange (file) {
        this.formValidate.picture = file ? file.id : ''
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
      },
      handleCategoryChange (val) {
        this.formValidate.category_id = val
      }
    },
    computed: mapState([
      'articles',
      'categories'
    ]),
    watch: {
      'articles.article': {
        handler (newVal) {
          const { id, ...others } = newVal

          this.formValidate = others
          this.$refs.editor.html(others.content)
        }
      }
    }
  }
</script>
