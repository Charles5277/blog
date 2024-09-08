// .vitepress/theme/index.js
import './tailwind.postcss';
import DefaultTheme from 'vitepress/theme';
import './firebase';
import './custom.css';

import { createVuestic } from 'vuestic-ui';

// - components
// import CustomFeatures from '../components/CustomFeatures.vue';
// import CustomLayout from './CustomLayout.vue';
import Tags from '../components/PostTags.vue';
import Category from '../components/PostCategory.vue';
import RouteCatalog from '../components/RouteCatalog.vue';

import CustomLayout from './CustomLayout.vue';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  async enhanceApp({ app }) {
    // app.component('CustomFeatures', CustomFeatures);
    app.component('PostTags', Tags);
    app.component('PostCategory', Category);
    app.component('RouteCatalog', RouteCatalog);

    app.use(createVuestic());
  },
};
