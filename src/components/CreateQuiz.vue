<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Create New Quiz</h3>
            <form @submit.prevent="addOrEditQuiz">
              <div class="form-group mb-3">
                <label for="title">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="quiz.title"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="scenario">Scenario</label>
                <textarea
                  class="form-control"
                  id="scenario"
                  v-model="quiz.scenario"
                  required
                  rows="4"
                ></textarea>
              </div>
              <div class="form-group mb-3">
                <label for="folder">Folder</label>
                <select class="form-control" v-model="quiz.folder">
                  <option value="">No Folder</option>
                  <option v-for="folder in folders" :key="folder._id" :value="folder._id">
                    {{ folder.name }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ editIndex === -1 ? "Create Quiz" : "Edit Quiz" }}
              </button>
            </form>
          </div>
        </div>

        <!-- Folder Management Card -->
        <div class="card mt-4">
          <div class="card-body">
            <h3 class="card-title">Manage Folders</h3>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                v-model="newFolderName"
                placeholder="New folder name"
                @keyup.enter="createFolder"
              >
              <button class="btn btn-success" @click="createFolder">
                Add Folder
              </button>
            </div>
            <ul class="list-group">
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
                v-for="folder in folders"
                :key="folder._id"
              >
                <div>
                  <strong>{{ folder.name }}</strong>
                  <span class="badge bg-primary ms-2">{{ folderStats[folder._id] || 0 }} quizzes</span>
                </div>
                <div class="btn-group">
                  <button class="btn btn-warning btn-sm" @click="editFolder(folder)">
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deleteFolder(folder._id)">
                    Delete
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- Folder Navigation -->
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Folders</h5>
              <button 
                class="btn btn-outline-secondary btn-sm" 
                @click="setCurrentFolder(null)"
                :class="{ 'active': currentFolder === null }"
              >
                All Quizzes
              </button>
            </div>
            <div class="folder-tags mt-2">
              <span
                v-for="folder in folders"
                :key="folder._id"
                class="badge bg-light text-dark me-1 mb-1 cursor-pointer"
                :class="{ 'bg-primary text-white': getFolderId(folder._id) === currentFolder }"
                @click="setCurrentFolder(folder._id)"
              >
                {{ folder.name }} ({{ folderStats[folder._id] || 0 }})
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Added Quizzes</h3>
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(q, index) in filteredQuizzes"
                :key="index"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <span>
                      <RouterLink :to="`/quiz/${q._id}/questions`">
                        {{ q.title }}
                      </RouterLink>
                    </span>
                    <br />
                    <span style="font-size: 12px" class="text-secondary">
                      Quiz Pin: {{ q.quizPin }}
                    </span>
                    <br />
                    <span style="font-size: 12px" class="text-muted">
                      Folder: {{ getFolderName(q.folder) }}
                    </span>
                  </div>
                  <div class="btn-group">
                    <select 
                      class="form-select form-select-sm" 
                      @change="moveQuiz(q._id, $event.target.value)"
                      :value="getFolderIdFromQuiz(q) || ''"
                    >
                      <option value="">Move to...</option>
                      <option v-for="folder in folders" :key="folder._id" :value="folder._id">
                        {{ folder.name }}
                      </option>
                    </select>
                    <button
                      class="btn-sm btn btn-warning"
    @click="editQuiz(q._id)"          
  >
    Edit
  </button>
  <button
    class="btn-sm btn btn-danger"
    @click="showDeleteConfirmation(q._id)"   
  >
    Delete
  </button>
  <button class="btn btn-info btn-sm" @click="duplicateQuiz(q._id)">
  Duplicate
</button>
</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
export default {
  data() {
    return {
      quiz: {
        scenario: "",
        title: "",
        folder: "",
        isAuthenticated: false
      },
      addedQuizzes: [],
      folders: [],
      newFolderName: "",
      editIndex: -1,
      deleteIndex: -1,
      currentFolder: null
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      try {
        await this.fetchFolders();
        await this.fetchAddedQuizzes();
      } catch (error) {
        console.error('Error loading data:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        }
      }
    } else {
      this.$router.push('/login');
    }
  },
  computed: {
    filteredQuizzes() {
  const quizzes = this.currentFolder === null
    ? this.addedQuizzes
    : this.addedQuizzes.filter(quiz => this.getFolderIdFromQuiz(quiz) === this.currentFolder);

  return [...quizzes].sort((a, b) => a._id > b._id ? 1 : -1);
},
    
    // Add this computed property to get accurate folder counts
    folderStats() {
      const stats = {};
      
      // Initialize all folders with 0 count
      this.folders.forEach(folder => {
        stats[folder._id] = 0;
      });
      
      // Count quizzes in each folder
      this.addedQuizzes.forEach(quiz => {
        const folderId = this.getFolderIdFromQuiz(quiz);
        if (folderId && stats[folderId] !== undefined) {
          stats[folderId]++;
        }
      });
      
      return stats;
    }
  },
  methods: {
    // Helper methods to handle folder data consistently
    getFolderId(folderInput) {
      // Handle both folder object or folder ID string
      if (!folderInput) return null;
      return folderInput._id || folderInput;
    },
    
    getFolderIdFromQuiz(quiz) {
      // Extract folder ID from a quiz
      return this.getFolderId(quiz.folder);
    },
    
    getFolderObject(folderId) {
      // Find folder object by ID
      return this.folders.find(f => f._id === folderId);
    },

    // Main methods
    async fetchAddedQuizzes() {
      try {
        const response = await api.getQuizzes();
        this.addedQuizzes = response.data;
      } catch (error) {
        console.error("Error fetching added quizzes:", error);
      }
    },

    validateQuiz(quiz) {
      if (!quiz.scenario) {
        alert("Please enter a scenario.");
        return false;
      }

      if (!quiz.title) {
        alert("Please enter quiz title.");
        return false;
      }

      return true;
    },

    resetQuiz() {
      this.quiz = {
        scenario: "",
        title: "",
        folder: ""
      };
      this.editIndex = -1;
    },

   editQuiz(quizId) {
  const quiz = this.addedQuizzes.find(q => q._id === quizId);
  if (!quiz) return;
  this.quiz = {
    scenario: quiz.scenario,
    title: quiz.title,
    folder: this.getFolderIdFromQuiz(quiz) || ""
  };
  this.editIndex = this.addedQuizzes.findIndex(q => q._id === quizId);
},

showDeleteConfirmation(quizId) {
  if (window.confirm("Are you sure you want to delete this quiz?")) {
    this.deleteQuiz(quizId);
  }
},

async deleteQuiz(quizId) {
  try {
    await api.deleteQuiz(quizId);
    this.addedQuizzes = this.addedQuizzes.filter(q => q._id !== quizId);
  } catch (error) {
    console.error(error);
    alert("Error deleting the quiz. Please try again.");
  }
},

async duplicateQuiz(quizId) {
  try {
    await api.duplicateQuiz(quizId);
    await this.fetchAddedQuizzes();
    alert('Quiz duplicated successfully');
  } catch (error) {
    console.error('Duplication error:', error);
    alert(error.response?.data?.message || 'Failed to duplicate quiz');
  }
},

    async addOrEditQuiz() {
      if (this.validateQuiz(this.quiz)) {
        try {
          const payload = {
            title: this.quiz.title,
            scenario: this.quiz.scenario,
            folder: this.quiz.folder || null
          };

          if (this.editIndex === -1) {
            const response = await api.createQuiz(payload);
            this.addedQuizzes.push(response.data);
          } else {
            const quizId = this.addedQuizzes[this.editIndex]._id;
            const response = await api.putQuiz(quizId, payload);
            this.addedQuizzes[this.editIndex] = response.data;
            this.editIndex = -1;
          }
          this.resetQuiz();
          await this.fetchFolders();
          await this.fetchAddedQuizzes();
        } catch (error) {
          console.error("Full error:", error);
          alert(`Error: ${error.response?.data?.message || error.message}`);
        }
      }
    },

    async fetchFolders() {
      try {
        const response = await api.getFolders();
        this.folders = response.data;
      } catch (error) {
        console.error("Error fetching folders:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        }
      }
    },

    async createFolder() {
      if (!this.newFolderName.trim()) {
        alert("Please enter a folder name");
        return;
      }
      try {
        const response = await api.createFolder({ name: this.newFolderName });
        this.newFolderName = "";
        await this.fetchFolders();
      } catch (error) {
        console.error("Error creating folder:", error);
        alert(error.response?.data?.message || "Failed to create folder");
      }
    },

    async editFolder(folder) {
      const newName = prompt("Enter new folder name:", folder.name);
      if (newName && newName.trim()) {
        try {
          await api.updateFolder(folder._id, { name: newName });
          this.fetchFolders();
        } catch (error) {
          console.error("Error updating folder:", error);
          alert(error.response?.data?.message || "Failed to update folder");
        }
      }
    },

    async deleteFolder(folderId) {
      if (confirm("Are you sure you want to delete this folder? Quizzes will be moved to 'No Folder'.")) {
        try {
          await api.deleteFolder(folderId);
          await this.fetchFolders();
          // Reset current folder if it was deleted
          if (this.currentFolder === folderId) {
            this.currentFolder = null;
          }
        } catch (error) {
          console.error("Error deleting folder:", error);
          alert(error.response?.data?.message || "Failed to delete folder");
        }
      }
    },

    async moveQuiz(quizId, folderId) {
      try {
        await api.moveQuizToFolder(folderId, { quizId });
        
        // Update local state
        const quizIndex = this.addedQuizzes.findIndex(q => q._id === quizId);
        if (quizIndex !== -1) {
          if (folderId) {
            // Find the folder object from folders array
            const folderObj = this.folders.find(f => f._id === folderId);
            this.addedQuizzes[quizIndex].folder = folderObj || folderId;
          } else {
            this.addedQuizzes[quizIndex].folder = null;
          }
        }
        
        await this.fetchFolders();
        await this.fetchAddedQuizzes();
      } catch (error) {
        console.error("Error moving quiz:", error);
        alert(error.response?.data?.message || "Failed to move quiz");
      }
    },

    setCurrentFolder(folderId) {
      this.currentFolder = folderId;
    },

    getFolderName(folderInput) {
      if (!folderInput) return "No Folder";
      
      // Get the folder ID first
      const folderId = this.getFolderId(folderInput);
      
      // Find the folder object
      const folder = this.folders.find(f => f._id === folderId);
      return folder ? folder.name : "Unknown Folder";
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.folder-tags {
  max-height: 100px;
  overflow-y: auto;
}
</style>