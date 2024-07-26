<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入用户名"
          v-model="searchForm.keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table
      :data="tableData"
      style="width: 100%"
      width="120px"
      align-items="center"
    >
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      size="small"
      :total="config.total"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
const tableData = ref([]);
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
  },
  {
    prop: "addr",
    label: "地址",
  },
]);
const searchForm = reactive({
  keyWord: "",
});
const config = reactive({
  name: "",
  toyal: 0,
  page: 1,
});
const handleSearch = () => {
  config.name = searchForm.keyWord;
  getUserData();
};
const handleCurrentChange = (currentPage) => {
  config.page = currentPage;
  getUserData();
};
const deleteUser = (row) => {
  console.log(row.id);
  ElMessageBox.confirm("是否确认删除该用户？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await proxy.$api.deleteUser({ id: row.id });
    ElMessage.success("删除成功");
    getUserData();
  });
};
const { proxy } = getCurrentInstance();
const getUserData = async () => {
  const data = await proxy.$api.getUserData(config);
  //console.log(data);
  tableData.value = data.list.map((item) => ({
    ...item,
    sexLabel: item.sex === 1 ? "男" : "女",
  }));
  config.total = data.count;
};

//控制对话框是否显示
const dialogVisible = ref(false);
//新增和编辑共用一个窗口，所以通过设置action区分
const action = ref("add");
const formUser = reactive({});
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项" }],
});
const handleClose = () => {
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
};
const handleCancel = () => {
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
};
const handleAdd = () => {
  dialogVisible.value = true;
  action.value = "add";
};
const timerFormat = (time) => {
  var time = new Date(time);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  function format(num) {
    return num < 10 ? "0" + num : num;
  }
  return year + "-" + format(month) + "-" + format(day);
};
const onSubmit = () => {
  proxy.$refs["userForm"].validate(async (valid) => {
    if (valid) {
      let res = null;
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
        ? formUser.birth
        : timerFormat(formUser.birth);
      if (action.value === "add") {
        res = await proxy.$api.addUser(formUser);
      } else {
        res = await proxy.$api.editUser(formUser);
      }
      if (res) {
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields();
        getUserData();
        ElMessage.success("操作成功");
      }
    } else {
      ElMessage.error("请检查输入项");
    }
  });
};
const handleEdit = async (row) => {
  dialogVisible.value = true;
  action.value = "edit";
  nextTick(() => {
    Object.assign(formUser, { ...row, sex: "" + row.sex });
  });
};
onMounted(() => {
  getUserData();
});
</script>

<style lang="scss" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.table {
  position: relative;
  height: 560px;
  .pagination {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }
  .el-table {
    width: 100%;
    height: 500px;
  }
}
/* .el-pagination {
  margin-top: 20px;
} */
.select-clearn {
  display: flex;
}
</style>
