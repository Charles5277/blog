import DefaultTheme from 'vitepress/theme';
import { createVuestic } from 'vuestic-ui';

import OptimizedHeroImage from '../components/OptimizedHeroImage.vue';
import Category from '../components/PostCategory.vue';

// - components
import Tags from '../components/PostTags.vue';
import RouteCatalog from '../components/RouteCatalog.vue';
import CustomLayout from './CustomLayout.vue';

import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  async enhanceApp({ app }) {
    app.component('PostTags', Tags);
    app.component('PostCategory', Category);
    app.component('RouteCatalog', RouteCatalog);
    app.component('OptimizedHeroImage', OptimizedHeroImage);

    app.use(createVuestic());
  },
};
