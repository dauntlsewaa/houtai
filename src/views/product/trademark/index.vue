<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <div slot="header">
      <!-- 品牌添加按钮 -->
      <el-button type="primary" size="default" icon="el-icon-plus" @click="addTrademark" v-btn="'btn.Trademark.add'"
        >添加</el-button
      >
    </div>

    <!-- 品牌表格数据展示 -->.

    <el-table :data="records" border stripe style="margin: 20px 0" v-loading="loading">
      <el-table-column label="序号" type="index" width="80" align="center">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" width="100" height="80" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini "
            icon="el-icon-edit-outline"
            @click="UpdateTrademark(scope.row)"
          ></el-button>
          <el-button
            type="danger "
            size="mini "
            icon="el-icon-delete"
            @click="deleteTrademark(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      background
      :pager-count="7"
      @current-change="getListData"
      @size-change="sizeChange"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
      :title="this.tmObj.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        label-width="120px"
        ref="fromRef"
        :model="tmObj"
        status-icon
        :rules="rules"
      >
        <el-form-item label="品牌名称" style="width: 80%" prop="tmName">
          <el-input
            clearable
            size="small "
            autofocus
            :value.sync="tmObj.tmName"
            @input="handler"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO " prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmObj.logoUrl" :src="tmObj.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAndUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { reqAddAndSaveTrademark, reqDeleteTrademark } from "@/api/product/trademark";
export default {
  name: "Trademark",
  data() {
    return {
      currentPage: 1, //页码
      pageSize: 3, //数据展示条数
      dialogFormVisible: false, //对话框显示与隐藏
      loading: false, //加载状态
      tmObj: {
        tmName: "", //品牌名称
        logoUrl: "", //图片地址
      },
      rules: {
        tmName: { required: true, message: "品牌名称最小2位数", trigger: "blur", min: 2 },
        logoUrl: { required: true, message: "请你上传logo图片" },
      },
    };
  },
  mounted() {
    this.getListData();
  },

  methods: {
    // 请求品牌数据
    getListData(page = 1) {
      this.currentPage = page;
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
      };
      this.loading = true;
      this.$store.dispatch("trademark/getTrademark", data);
      this.loading = false;
    },
    // 更新页码显示数据
    sizeChange(limit) {
      this.pageSize = limit;
      this.getListData();
    },
    // 搜集品牌名称
    handler(name) {
      let tmName = name.trim();
      this.tmObj.tmName = tmName;
    },
    //上传图片成功的钩子
    handleAvatarSuccess(res, file) {
      this.tmObj.logoUrl = res.data;
    },
    //图片上传成功之前的钩子
    beforeAvatarUpload(rawFile) {
      if (
        rawFile.type == "image/jpeg" ||
        rawFile.type == "image/png" ||
        rawFile.type == "image/gif"
      ) {
        //约束大小1024B->1K->1M->1G->1T
        if (rawFile.size / 1024 / 1024 <= 5) {
          return true;
        }
      } else {
        return false;
      }
    },
    // 添加或修改品牌
    addAndUpdate() {
      this.$refs.fromRef.validate(async (success) => {
        if (success) {
          await reqAddAndSaveTrademark(this.tmObj);
          this.$message({
            message: this.tmObj.id ? "品牌修改成功" : "品牌添加成功",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getListData(this.tmObj.id ? this.currentPage : 1);
        } else {
          this.$message.error("网络错误，请重新上传");
        }
      });
    },
    // 添加品牌按钮回调
    addTrademark() {
      // 清空原有数据
      this.tmObj = {
        tmName: "", //品牌名称
        logoUrl: "", //图片地址
        id: "", //id
      };
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs.fromRef.resetFields();
      });
    },
    // 修改品牌按钮回调
    UpdateTrademark(row) {
      this.dialogFormVisible = true;
      this.tmObj = row;
    },
    // 删除品牌按钮回调
    async deleteTrademark(row) {
      try {
        await reqDeleteTrademark(row.id);
        this.getListData(this.currentPage);
        this.$message({
          message: `${row.tmName}删除成功`,
          type: "success",
        });
      } catch (error) {
        this.$message.error("网络错误，请重新操作");
      }
    },
  },
  computed: {
    ...mapGetters(["total", "records"]),
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
