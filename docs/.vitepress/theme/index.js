// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
// import CustomFeatures from '../components/CustomFeatures.vue';
// import CustomLayout from './CustomLayout.vue';
import './tailwind.postcss';
import './firebase';
import './custom.css';

export default {
  extends: DefaultTheme,
  // Layout: CustomLayout,
  // enhanceApp({ app }) {
  //   app.component('CustomFeatures', CustomFeatures);
  // },
};
