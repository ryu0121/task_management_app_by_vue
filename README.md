# task_management_app

## Overview

かんばん方式のタスク管理ツールです。

https://user-images.githubusercontent.com/56571304/215309625-39b36f81-7910-4808-bfb4-33cf980acd20.mov

## Remaining task

以下は改善したい点。Vueの基本的な状態管理は把握したので一旦終わっている。(Vuex, Composition APIのprovide, injectを除く)
- タスクの縦の表示範囲を制限して、スクロールできるようにする。
- 下書きのままドラッグ移動させると、別のセクションに移動させた場合に下書きの内容が消えてしまうバグ修正。
- デザイン面の改善。

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

## Reference

- draggable
  https://github.com/SortableJS/vue.draggable.next
- 公式(Composition API への置き換え方)
  https://v3.ja.vuejs.org/guide/composition-api-introduction.html
- Vue3 の大きな変更点
  https://zenn.dev/miyanokomiya/articles/76bc7b48fbc614
- Vue3 で情報の受け渡し方
  https://qiita.com/jay-es/items/8b3b2bf06eeefdc43a5a
- props を使った draggable の適用方法
  https://review-me.tech/post/detail/124
- 複数 Component、複数配列を跨いだ draggable の適用方法
  https://www.ritolab.com/posts/173
