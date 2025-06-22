<template>
  <div class="users-container">
    <div class="users-card">
      <h2 class="users-title">用户管理</h2>
      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>编号</th>
              <th>姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="table-row">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.sex }}</td>
              <td>{{ user.age }}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="edit-btn" 
                    @click="handleEdit(user)"
                    title="修改用户"
                  >
                    修改
                  </button>
                  <button 
                    class="delete-btn" 
                    @click="handleDelete(user)"
                    title="删除用户"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="users.length === 0" class="empty-state">
        <p>暂无用户数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, deleteUserById } from '../http/users.js'

export default {
  data() {
    return {
      users: []
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    loadUsers() {
      getUsers().then(res => {
        if(res.data.code === 200){
          this.users = res.data.data
        } else {
          alert('获取用户失败：' + res.data.message)
        }
      }).catch(err => {
        console.error(err)
        alert('获取用户数据失败，请稍后重试')
      })
    },
    handleEdit(user) {
      this.$router.push({ name: 'UserEditView', params: { id: user.id }})
    },
    handleDelete(user) {
      if (confirm(`确定删除用户 "${user.username}" 吗？`)) {
        deleteUserById(user.id).then(res => {
          if (res.data.code === 200) {
            alert('删除成功')
            this.loadUsers()
          } else {
            alert('删除失败：' + res.data.message)
          }
        }).catch(err => {
          console.error(err)
          alert('删除请求失败，请稍后重试')
        })
      }
    }
  }
}
</script>

<style scoped>
.users-container {
  min-height: 100vh;
  background: #2d2d2d;
  padding: 2rem;
}

.users-card {
  max-width: 1200px;
  margin: 0 auto;
  background: #2d2d2d;
  color: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.users-title {
  font-weight: bold;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #409EFF;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  background: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.users-table th {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  position: sticky;
  top: 0;
  z-index: 10;
}

.users-table th:first-child {
  border-top-left-radius: 12px;
}

.users-table th:last-child {
  border-top-right-radius: 12px;
}

.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-row:hover {
  background-color: rgba(64, 158, 255, 0.1);
  transform: scale(1.01);
}

.table-row:last-child {
  border-bottom: none;
}

.users-table td {
  padding: 1rem;
  color: #ccc;
  font-size: 0.95rem;
  vertical-align: middle;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
}

.edit-btn {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.delete-btn {
  background: #ff4757;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.delete-btn:hover {
  background: #ff3742;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #888;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .users-container {
    padding: 1rem;
  }
  
  .users-card {
    padding: 1.5rem;
  }
  
  .users-title {
    font-size: 1.8rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .edit-btn,
  .delete-btn {
    width: 100%;
    padding: 8px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .users-container {
    padding: 0.5rem;
  }
  
  .users-card {
    padding: 1rem;
  }
  
  .users-title {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.5rem 0.3rem;
    font-size: 0.85rem;
  }
  
  /* 在极小屏幕上隐藏一些列 */
  .users-table th:nth-child(3),
  .users-table td:nth-child(3),
  .users-table th:nth-child(4),
  .users-table td:nth-child(4) {
    display: none;
  }
}

/* 表格滚动条样式 */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #444;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>