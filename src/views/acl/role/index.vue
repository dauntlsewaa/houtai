<template>
  <div style="padding:20px">
    <!-- 搜索栏 -->
    <div>
      <el-input
        placeholder="角色名称"
        size="small"
        style="width: 180px; margin-right: 20px"
        clearable
      ></el-input>
      <el-button type="primary" size="small " icon="el-icon-search">查询</el-button>
      <el-button size="small">清空</el-button>
    </div>
    <!-- 添加删除按钮 -->
    <div style="margin: 20px 0">
      <el-button type="primary" size="small">添加</el-button>
      <el-button type="danger" size="small">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="items" border stripe style="width:80%">
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="600px"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}"> 
          <el-button type="info" size="small" icon="el-icon-info"></el-button>
          <el-button type="primary" size="small" icon="el-icon-check"></el-button>
          <el-button type="primary" size="small" icon="el-icon-edit-outline"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getRoleData"
      :current-page.sync="currentPage"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      background
      style="margin-top: 20px"
      :pager-count="7"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      currentPage: 1, //页码
      pageSize: 5, //页面展示数据条数
      total: 0, //总页码
      items: [], //表格数据
    };
  },
  mounted() {
    this.getRoleData();
  },
  methods: {
    async getRoleData(page = 1) {
      this.currentPage = page;
      let result = await this.$API.role.getPageList(this.currentPage, this.pageSize, {});
      console.log(result);
      this.total = result.data.total;
      this.items = result.data.items;
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getRoleData();
    },
  },
};
</script>

<style></style>
