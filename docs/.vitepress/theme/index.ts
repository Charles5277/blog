import DefaultTheme from 'vitepress/theme';
import './custom.css';

import { createVuestic } from 'vuestic-ui';

// - components
import Tags from '../components/PostTags.vue';
import Category from '../components/PostCategory.vue';
import RouteCatalog from '../components/RouteCatalog.vue';
import OptimizedImage from '../components/OptimizedImage.vue';

import CustomLayout from './CustomLayout.vue';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  async enhanceApp({ app }) {
    app.component('PostTags', Tags);
    app.component('PostCategory', Category);
    app.component('RouteCatalog', RouteCatalog);
    app.component('OptimizedImage', OptimizedImage);

    app.use(createVuestic());
  },
};
