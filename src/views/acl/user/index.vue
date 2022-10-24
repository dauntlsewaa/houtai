<template>
  <el-card shadow="always">
    <!-- 搜索栏 -->
    <div>
      <el-input
        v-model="input"
        placeholder="用户名"
        autofocus
        size="mini"
        style="width: 180px; margin-right: 20px"
      ></el-input>
      <el-button type="primary" size="small " icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button size="small" @click="clear">清空</el-button>
    </div>
    <!-- 添加删除按钮 -->
    <div style="margin: 20px 0">
      <el-button type="primary" size="small" @click="AddUser" v-btn="'btn.User.add'"
        >添加</el-button
      >
      <el-button
        type="danger"
        :disabled="multipleSelection.length === 0"
        size="small"
        @click="clear"
        v-btn="'btn.User.remove'"
        >批量删除</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :data="items"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="80px">
      </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>
      <el-table-column label="用户名称" prop="nickName"> </el-table-column>
      <el-table-column label="角色列表" prop="roleName"> </el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate"> </el-table-column>
      <el-table-column label="更新时间" prop="gmtModified"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            icon="el-icon-user"
            @click="Roles(scope.row)"
            v-btn="'btn.User.assgin'"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="UpdateUser(scope.row)"
            v-btn="'btn.User.update'"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteUser(scope.row.id)"
            v-btn="'btn.User.remove'"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getUserData"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      background
      :pager-count="7"
      style="margin-top: 20px"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
      :title="this.data.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogFormVisible"
    >
      <el-form label-width="100px" ref="fromRef" status-icon :rules="rules" :model="data">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="data.username"
            :disabled="this.allRolesList.length !== 0"
          ></el-input>
        </el-form-item>
        <div v-if="this.allRolesList.length === 0">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="data.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!this.data.id">
            <el-input v-model="data.password"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="角色列表" v-else>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox 
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group v-model="assignRoles" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in allRolesList" :label="item" :key="item">{{
              item
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" v-if="assign.length">
        <el-button type="primary" @click="UpdateRoles">保存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddEndUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      input: "", //搜索栏搜集内容
      currentPage: 1, //页码
      pageSize: 5, //页面展示数据条数
      total: 0, //总页码
      items: [], //表格数据
      dialogFormVisible: false, //对话框显示
      data: {
        nickName: "", //用户昵称
        password: "", // 用户密码
        username: "", //用户名称
      }, //携带参数
      rules: {
        nickName: {
          required: true,
          message: "昵称需为2 to 8",
          trigger: "blur",
          min: 2,
          max: 8,
        },
        password: {
          required: true,
          message: "密码需为2 to 8",
          trigger: "blur",
          min: 2,
          max: 8,
        },
        username: {
          required: true,
          message: "用户名称需为4 to 8",
          trigger: "blur",
          min: 4,
          max: 8,
        },
      }, //验证规则
      allRolesList: [], //角色列表
      assignRoles: [], //角色权限列表
      isIndeterminate: true, //全选
      checkAll: false,
      userId: "", //用户id
      assign: [], //所有的角色列表数据
      multipleSelection: [],
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    // 请求用户管理表格数据
    async getUserData(page = 1) {
      this.currentPage = page;
      let result = await this.$API.user.getPageList(this.currentPage, this.pageSize, {});
      this.total = result.data.total;
      this.items = result.data.items;
    },
    // 点击页码更新页面展示数据
    sizeChange(limit) {
      this.pageSize = limit;
      this.getUserData();
    },
    // 查询按钮回调
    async search() {
      if (this.input.trim()) {
        let result = await this.$API.user.getPageList(this.currentPage, this.pageSize, {
          username: this.input,
        });
        this.total = result.data.total;
        this.items = result.data.items;
      } else {
        this.$notify({
          message: "请输入用户名",
          type: "warning",
          duration: 800,
        });
      }
    },
    // 清空按钮回调
    clear() {
      this.input = "";
      this.getUserData();
    },
    // 添加或修改按钮回调
    AddEndUpdate() {
      this.$refs.fromRef.validate(async (success) => {
        if (success) {
          if (this.data.id) {
            await this.$API.user.update(this.data);
          } else {
            await this.$API.user.add(this.data);
          }
          this.getUserData(this.data.id ? this.currentPage : 1);
          this.$message({
            message: this.data.id ? "修改成功" : "添加成功",
            type: "success",
          });
          this.dialogFormVisible = false;
        } else {
          this.$message.error("网络错误，请重新上传");
        }
      });
    },
    // 添加按钮回调
    AddUser() {
      this.dialogFormVisible = true;
      removeData();

      this.$nextTick(() => {
        this.$refs.fromRef.resetFields();
      });
    },
    // 修改按钮回调
    UpdateUser(row) {
      this.dialogFormVisible = true;
      this.data = row;
    },
    // 获取某个用户的权限
    async Roles(row) {
      this.removeData();
      this.userId = row.id;
      let result = await this.$API.user.getRoles(this.userId);
      this.data.username = row.username;
      this.assign = result.data.allRolesList;
      this.allRolesList = result.data.allRolesList.map((item) => item.roleName);
      this.assignRoles = result.data.assignRoles.map((item) => item.roleName);
      this.dialogFormVisible = true;
    },
    // 修改全选状态
    handleCheckAllChange(val) {
      this.assignRoles = val ? [...this.allRolesList] : [];
      this.isIndeterminate = false;
    },
    // 选中的角色
    handleCheckedCitiesChange(value) {
      this.checkAll = value.length === this.allRolesList.length;
      this.isIndeterminate = value.length > 0 && value.length < this.allRolesList.length;
    },
    // 更新用户权限
    async UpdateRoles() {
      let roleId = this.assignId.join(",");
      try {
        await this.$API.user.assignRoles(this.userId, roleId);
        this.$message({
          type: "success",
          message: "分配角色成功",
        });
        this.dialogFormVisible = true;
        this.getUserData();
      } catch (error) {
        this.$message.error("网络错误，请重新分配");
      }
    },
    // 清空数据
    removeData() {
      this.allRolesList = "";
      this.assignRoles = "";
      this.data = {
        nickName: "", //用户昵称
        password: "", // 用户密码
        username: "", //用户名称
      };
    },
    // 删除用户
    async deleteUser(id) {
      try {
        this.$API.user.removeById(id);
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getUserData(this.currentPage);
      } catch (error) {
        this.$message.error("网络错误，请重新操作");
      }
    },
    // 多选框全选状态
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量删除按钮回调
    clear() {
      let ids = this.multipleSelection.map((item) => item.id);

      try {
        this.$alert("确定删除数据吗？", {
          confirmButtonText: "确定",

          callback: async (action) => {
            await this.$API.user.removeUsers(ids);
            this.$message({
              type: "success",
              message: "批量删除成功",
            });
            this.getUserData();
          },
        });
      } catch (error) {
        this.$message.error("网络错误，请重新操作");
      }
    },
  },
  computed: {
    // 计算勾选状态
    assignId() {
      return this.assign.reduce((per, next) => {
        this.assignRoles.forEach((item) => {
          if (next.roleName === item) {
            per.push(next.id);
          }
        });
        return per;
      }, []);
    },
  },
};
</script>

<style></style>
