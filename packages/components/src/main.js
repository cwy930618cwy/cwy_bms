import "vue-touch-ripple/dist/vue-touch-ripple.css";
import Vue from "vue";
import MsbDialog from "./MsbDialog/MsbDialog.vue";
import DialogPlugin from "./MsbDialog/dialog.plugin";
import Button from "./Button/Button.vue";
import ErrorLog from "./ErrorLog/ErrorLog.vue";
import Form from "./Form/Form.vue";
import Hamburger from "./Hamburger/Hamburger.vue";
import NavMenu from "./NavMenu/NavMenu.vue";
import Pagination from "./Pagination/Pagination.vue";
import Search from "./Search/Search.vue";
import SvgIcon from "./SvgIcon/SvgIcon.vue";
import Table from "./Table/Table.vue";
import Upload from "./Upload/Upload.vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Element);

export {
  MsbDialog,
  Button,
  ErrorLog,
  Form,
  Hamburger,
  NavMenu,
  Pagination,
  Search,
  SvgIcon,
  Table,
  Upload,
  DialogPlugin,
};
