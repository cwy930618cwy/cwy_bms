import { storiesOf } from "@storybook/vue";
import { Input } from "../dist/components";

storiesOf("Input", module).add("Input", () => ({
  components: { Input },
  data() {
    return {};
  },
  template: `
  <Input :value="'nihao'" type="text" />`,
}));
