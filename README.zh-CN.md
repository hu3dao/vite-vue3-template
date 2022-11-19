# vue3 企业级项目模板搭建

## 技术选型

- 构建工具 - vite
- 前端框架 - vue3
- 编程语言 - typescript
- 代码检测工具 - eslint
- 代码格式化工具 - prettier
- 规范代码提交工具 - husky、commitlint、lint-staged
- css 代码检测工具 - stylelint
- 编辑器 - vscode
- 包管理工具 - pnpm

## 初始化项目

```
pnpm create vite vite-vue3-template --template vue-ts
```

## 集成 eslint 和 prettier

我们需要先安装这两个 vscode 插件 ESlint 和 Prettier

- eslint：代码检测工具，检测代码的语法错误和潜在的 Bug，目的是保证团队之间代码一
  致性和避免错误
- prettier：代码格式化工具，用于检测代码中的格式问题，比如单行代码长度、tab 长度
  、空格、逗号表达式等
- 区别和联系：eslint 偏向于把控代码的代码质量，prettier 偏向于统一项目的编码风格
  ，eslint 也有小部分代码格式化功能，一般和 prettier 结合使用
- eslint-import-resolver-typescript - 让 import 时可以使用别名（@），

### 安装依赖

```
pnpm install eslint eslint-plugin-vue eslint-config-prettier prettier eslint-plugin-prettier eslint-plugin-import eslint-config-airbnb-base @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-import-resolver-typescript -D
```

```
+ eslint 8.27.0
+ eslint-config-airbnb-base 15.0.0
+ eslint-config-prettier 8.5.0
+ eslint-plugin-import 2.26.0
+ eslint-plugin-prettier 4.2.1
+ eslint-plugin-vue 9.7.0
+ prettier 2.7.1
+ @typescript-eslint/eslint-plugin 5.43.0
+ @typescript-eslint/parser 5.43.0
+ eslint-import-resolver-typescript 3.5.2
```

- eslint - eslint 检测代码的核心库
- prettier - prettier 格式化代码的核心库
- eslint-config-airbnb-base - 目前业界最火的 eslint 规范是 airbnb，airbnb 有两个
  版本配置：eslint-config-airbnb 自带兼容 react 配置的和
  eslint-config-airbnb-base 基本 javascript 的配置，我们的项目是 vue，所以安装
  eslint-config-airbnb-base，依赖 eslint-plugin-import
- eslint-plugin-import - eslint-config-airbnb-base 的前置插件
- eslint-config-prettier - 禁用和 prettier 配置相冲突的规则
- eslint-plugin-prettier - 将 prettier 结合到 eslint 的插件，一般和
  eslint-config-prettier 配合使用
- eslint-plugin-vue - eslint 在 vue 里的代码规范
- @typescript-eslint/parser - eslint 的解析器，用于解析 typescript，从而检查和规
  范 typescript 的代码
- @typescript-eslint/eslint-plugin - eslint 的插件，包含了定义好的检测
  typescript 代码的规范

### 修改 eslint 配置文件

在项目根目录下创建.eslintrc.cjs 文件，因为 eslint 是 node 工具，使用的是 commojs
的规范，所以配置文件的后缀为 cjs（esmodule 规范文件名后缀为 mjs）

```js
// .eslintrc.cjs

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
    'import/resolver': {
      typescript: {}, // 读取tsconfig.json到eslint，实现别名不报错
    },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    // 对后缀的检测
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],
    'no-param-reassign': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
  },
}
```

### 增加 eslint 检测和修复命令

在 package.json 的 scripts 增加 lint 命令

```json
"scripts": {
  "lint": "eslint src/**/*.{js,jsx,ts,tsx,vue} --fix"
},
```

### 结合 vite 使用

- vite-plugin-eslint - vite 的插件，让项目可以方便的得到 eslint 的支持，完成
  eslint 的配置后，可以快速集成到 vite 中，方便开发者第一时间发现不符合 eslint
  规范的提示

```
pnpm install vite-plugin-eslint -D

+ vite-plugin-eslint 1.8.1
```

```ts
// vite.config.ts

import eslintPlugin from "vite-plugin-eslint";
plugins: [vue(), eslintPlugin()],
```

### 修改 eslint 忽略配置文件

在根目录下创建 .eslintignore 文件

```
lib
dist
node_modules
components.d.ts
```

### 修改 prettier 配置文件

在根目录下创建 .prettierrc.cjs 文件，用于定义格式化的规则（如何格式化），根据项
目实际情况自定义

```js
// .prettierrc.cjs

module.exports = {
  // 1.一行代码的最大字符数，默认是80(printWidth: <int>)
  printWidth: 80,
  // 2.tab宽度为2空格(tabWidth: <int>)
  tabWidth: 2,
  // 3.是否使用tab来缩进，我们使用空格(useTabs: <bool>)
  useTabs: false,
  // 4.结尾是否添加分号，false的情况下只会在一些导致ASI错误的其工况下在开头加分号，我选择无分号结尾的风格(semi: <bool>)
  semi: false,
  // 5.使用单引号(singleQuote: <bool>)
  singleQuote: true,
  // 6.object对象中key值是否加引号（quoteProps: "<as-needed|consistent|preserve>"）as-needed只有在需求要的情况下加引号，consistent是有一个需要引号就统一加，preserve是保留用户输入的引号
  quoteProps: 'as-needed',
  // 7.在jsx文件中的引号需要单独设置（jsxSingleQuote: <bool>）
  jsxSingleQuote: false,
  // 8.尾部逗号设置，es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况，需要node8和es2017以上的环境。（trailingComma: "<es5|none|all>"）
  trailingComma: 'es5',
  // 9.object对象里面的key和value值和括号间的空格(bracketSpacing: <bool>)
  bracketSpacing: true,
  // 10.jsx标签多行属性写法时，尖括号是否另起一行(jsxBracketSameLine: <bool>)
  jsxBracketSameLine: false,
  // 11.箭头函数单个参数的情况是否省略括号，默认always是总是带括号（arrowParens: "<always|avoid>"）
  arrowParens: 'always',
  // 12.range是format执行的范围，可以选执行一个文件的一部分，默认的设置是整个文件（rangeStart: <int>  rangeEnd: <int>）
  rangeStart: 0,
  rangeEnd: Infinity,
  // 18. vue script和style标签中是否缩进,开启可能会破坏编辑器的代码折叠
  // vueIndentScriptAndStyle: false,
  // 19.    endOfLine: "<lf|crlf|cr|auto>" 行尾换行符,默认是lf,
  endOfLine: 'lf',
  // 20.embeddedLanguageFormatting: "off",默认是auto,控制被引号包裹的代码是否进行格式化
  // embeddedLanguageFormatting: 'off',
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在开头文件插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'always',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
}
```

### 修改 prettier 忽略配置文件

在根目录下创建 .prettierignore 文件

```
/dist/*
.local
/node_modules/**
src/.DS_Store

**/*.svg
**/&.sh

/publish/*
components.d.ts
```

### 增加 prettier 格式化命令

在 package.json 的 scripts 增加 prettier:format 命令

```json
  "scripts": {
    "prettier:format": "prettier --config .prettierrc.cjs src/**/*.{js,jsx,ts,tsx,vue} --write"
  },
```

## 集成 husky、lint-staged、commitlint

- husky - 一个为 git 客户端增加 hook 的工具，在一些 git 操作前自动触发函数，如果
  我们希望在检测错误的同时，自动修复 eslint 语法错误，就可以通过它提供的钩子函数
  实现
- lint-staged - 过滤出 git 暂存区文件（git add 的文件）的工具，将所有暂存文件的
  列表传递给任务
- commitlint - 对 git commit 提交的注释进行校验的工具

### 安装依赖

- @commitlint/cli - commitlint 的核心代码库
- @commitlint/config-conventional - 通用的提交规范

```
pnpm install husky lint-staged @commitlint/cli @commitlint/config-conventional -D

+ husky 8.0.2
+ lint-staged 13.0.3
+ @commitlint/cli 17.2.0
+ @commitlint/config-conventional 17.2.0
```

### 生成 husky 脚本

在 package.json 的 scripts 增加 prepare 命令并执行

- prepare - 在开发模式下（运行 npm install 时），就会运行此脚本命令，简单的说就
  是安装依赖的时候就会去生成 husky 的脚本
- husky 命令
  - add - 添加一个钩子
  - set - 覆盖一个钩子

```json
  "scripts": {
    "prepare": "husky install"
  },
```

```
pnpm prepare
```

### commit 前代码校验及格式化

#### 添加 git 的 pre-commit 钩子

- pre-commit 钩子会在 git commit 命令执行前触发

执行下面的命令添加 pre-commit 钩子，在钩子触发时执行 npx lint-staged，过滤出暂存
区的代码，去执行后续的代码检测任务

```
npx husky add .husky/pre-commit "npx lint-staged"
```

#### 添加 lint-staged 的检测任务

在 package.json 添加 lint-staged 项（和 scripts 位置同级），对过滤出的
js、jsx、ts、tsx、vue 文件执行 eslint 的检测和 prettier 格式化

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,vue}": ["pnpm lint", "pnpm prettier:format"]
}
```

### commit message 校验

#### 添加 git 的 commit-msg 钩子

- commit-msg 钩子会在 git commit 时触发执行下面的命令添加 commit-msg 钩子，在钩
  子触发时执行 npx commitlint，对 commit message 进行校验，当不规范时终止提交，
  目前推荐使用 angular 规范

```
npx husky add .husky/commit-msg "npx --no -- commitlint --edit ${1}"
```

#### 修改 commitlint 配置文件

在根目录下创建 .commitlintrc.cjs 文件

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

### commit message 格式介绍

单行信息 - 用于业务代码提交时使用，业务代码一般来说更改比较多而且无法具体说明其
信息，具体的还需要看产品文档，所以用单行信息即可。

```xml
<type>(<scope>): <subject>
```

多行信息 - 用于提交一些不经常更改的功能型代码时使用，如：某个功能函数的新增、修
改或重构，目录结构的调整（工程化调整），架构的更改等，这些我们需要进行详细说明防
止出现遗忘

```xml
<type>(<scope>): <subject>
<BLANK LINE> // 空行
<body>
<BLANK LINE>
<footer>
```

字段说明

- type：类型

  | 类型     | 描述                                 |
  | -------- | ------------------------------------ |
  | build    | 发布版本                             |
  | chore    | 改变构建流程、或者增加依赖库、工具等 |
  | ci       | 持续集成修改                         |
  | feat     | 新特性                               |
  | fix      | 修改问题                             |
  | perf     | 优化相关，比如提升性能、体验         |
  | refactor | 代码重构                             |
  | revert   | 回滚到上一个版本                     |
  | style    | 代码格式修改                         |
  | test     | 测试用例修改                         |

- scope：影响的范围, 比如: \*（全局），route, component, utils,
  build，readme，css 等
- subject：概述，建议符
  合[50/72 formatting](https://stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)
- body：具体修改内容，描述为什么修改, 做了什么样的修改, 以及开发的思路等等，可以
  分为多行，建议符
  合[50/72 formatting](https://stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)
- footer：一些备注, 通常是 Breaking Changes（重要改动） 或 Closed Issues（修复
  Bug 的链接）

50/72 formatting 的简要总结：

- 第一行不超过 50 个字符
- 然后是一个空行
- 剩余的文本应以 72 个字符换行

示例

```xml
feat(eslint): 集成eslint

1. vscode安装Eslint扩展即可保存时自动格式化
2. 运行 pnpm lint 可全局进行格式化

可浏览README文件了解细节
```

## 集成 stylelint

我们需要先安装 Stylelint 这个 vscode 插件

- stylelint - css 代码检查器，帮助我们规避 css 代码中的错误并保持代码风格的一致

### 安装依赖

```
pnpm install stylelint stylelint-config-standard stylelint-config-standard-scss stylelint-config-prettier postcss-html stylelint-config-recommended-vue stylelint-config-recess-order postcss -D

+ postcss-html 1.5.0
+ stylelint-config-prettier 9.0.4
+ stylelint-config-recess-order 3.0.0
+ stylelint-config-recommended-vue 1.4.0
+ stylelint-config-standard-scss 6.1.0
+ postcss 8.4.19
```

- stylelint - Stylelint 核心代码库
- stylelint-config-standard - Stylelint 官方推荐规则
- stylelint-config-standard-scss - Stylelint 官方推荐 scss 规则
- stylelint-config-prettier - 关闭所有不必要的或可能与 Prettier 冲突的规则
- postcss-html - 用于解析 HTML（和类似 HTML）的 PostCSS 语法，可以用于识别 html
  或者 vue 中的样式
- stylelint-config-recommended-vue - 共享 Vue 配置，依赖于 postcss-html
- stylelint-config-recess-order - 用于属性排序

### 修改 stylelint 配置文件

在根目录下创建 .stylelintrc.cjs 文件

```js
// .stylelintrc.cjs

module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  overrides: [
    // 扫描 .vue/html 文件中的<style>标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
  ],
}
```

### 修改 stylelint 忽略配置文件

在根目录下创建 .stylelintignore 文件

```
public
dist
```

### 增加 stylelint 检测和格式化命令

在 package.json 的 scripts 增加 lint:style 命令

```json
"scripts": {
  "prettier:format": "prettier --config .prettierrc.cjs src/**/*.{js,jsx,ts,tsx,vue} --write"
},
```

### 结合 vite 使用

- vite-plugin-stylelint - vite 的插件，让项目可以方便的得到 stylelint 的支持，完
  成 stylelint 的配置后，可以快速集成到 vite 中，方便开发者第一时间发现不符合
  stylelint 规范的提示

```
pnpm install vite-plugin-stylelint -D

+ vite-plugin-stylelint 3.0.8
```

```ts
// vite.config.ts

import stylelintPlugin from 'vite-plugin-stylelint'
plugins: [vue(), eslintPlugin(), stylelintPlugin({ fix: true })], // fix: true 自动修复
```

### 结合 lint-staged 使用

添加到 lint-staged 中，对暂存区的文件样式进行格式化

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,vue}": [
    "pnpm lint",
    "pnpm prettier:format"
  ],
  "*.{html,css,sass,scss,vue}": [
    "pnpm lint:style"
  ]
}
```

## 调试功能与配置文件

团队成员 vscode 配置可能不一样，可能会对 eslint、prettier 和 stylelint 的使用出
现效果不一致的问题，所以可以为每个项目设置一个 vscode 的配置文件，当开发该项目时
，就会以此配置文件为准

在.vscode 文件夹新建 settings.json 文件

```json
// .vscode/settings.json

{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "scss", "less", "vue"],
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[ts]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 环境变量和模式

环境一般分为：开发、测试、预发布和生产
