import { storiesOf } from "@storybook/vue";
import { Search } from "../dist/components";

storiesOf("Search", module).add("Search", () => ({
  components: { Search },
  data() {
    return {
      searchList: [
        {
          type: "Input",
          key: "deptName",
          name: "",
          placeholder: "部门名称",
        },
      ],
    };
  },

  template: `<Search :searchList="searchList"/>`,
}));
