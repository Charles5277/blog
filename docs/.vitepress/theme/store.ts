import { ref, watch } from "vue";

interface BlogStore {
  pageBarIdx: number;
  currentPage: number;
  selectedCategory: string;
  selectedTags: string[];
  filterType: string;
  icon: string;
}

const blogStore = ref<BlogStore>({
  pageBarIdx: 1,
  currentPage: 1,
  selectedCategory: "",
  selectedTags: [],
  filterType: "",
  icon: "",
});

watch(
  () => blogStore.value.selectedCategory,
  (v: string) => {
    blogStore.value.icon = v || "";
  },
);

export default blogStore;
