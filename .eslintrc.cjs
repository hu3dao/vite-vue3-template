module.exports = {
  // 停止向上查找配置文件
  root: true,
  // 环境 浏览器 es最新语法 node环境
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  /**
   * 扩展eslint的规范语法（第三方提供的定义好的规范），数组中每一个配置继承它前面的配置
   * plugin:vue/vue3-strongly-recommended由eslint-plugin-vue提供，它提供了多个规范，我们使用官方最推荐的
   * airbnb-base由eslint-config-airbnb-base提供
   * prettier由eslint-config-prettier提供
   * eslint-config前缀可省略
   */
  extends: ['plugin:vue/vue3-strongly-recommended', 'airbnb-base', 'prettier'],
  // 指定要使用的解析器，它会将我们写的代码转换成ESTree（AST），eslint对ESTree进行校验
  parser: 'vue-eslint-parser',
  // 解析器的配置项
  parserOptions: {
    ecmaVersion: 'latest', // 支持的es版本
    parser: '@typescript-eslint/parser', // .vue文件的<script>使用@typescript-eslint/parser来解析
    sourceType: 'module', // 模块类型，默认为script，我们设置为module
    // 额外的语言类型
    ecmaFeatures: {
      tsx: true,
      jsx: true,
    },
  },
  // 全局定义的宏，在代码中使用全局变量就不会报错或警告
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  /**
   * 插件
   * 前缀eslint-plugin- 可以省略
   * vue提供了eslint插件eslint-plugin-vue，里面包含了parser和rules，
   * parser为vue-eslint-parser在上面的parser字段，rules为定义好的规则，在extedns字段
   */
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  // 自定义规则，优先级最高，覆盖上面extends集成的第三方规则，根据项目实际情况定义,一般情况下不要写太多自定义规则
  settings: {
    // 设置项目内的别名
    'import/resolver': {
      alias: {
        map: [['@', './src']],
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
  },
}
