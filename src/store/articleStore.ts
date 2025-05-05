import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './authStore';

interface Article {
  _id: string;
  title: string;
  abstract: string;
  authors: Array<{
    userId: string;
    fullName: string;
    email: string;
    institution: string;
    country: string;
    isCorresponding: boolean;
  }>;
  status: string;
  field: string;
  submitterId: string;
  editorId: string;
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;
}

interface ArticleStore {
  articles: Article[];
  article: Article | null;
  loading: boolean;
  error: string | null;
  stats: Record<string, number>;
  fetchArticles: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchArticleById: (id: string) => Promise<void>;
  fetchArticleStats: () => Promise<void>;
  createArticle: (data: Partial<Article>) => Promise<void>;
  updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  changeArticleStatus: (id: string, status: string, reason: string) => Promise<void>;
  assignEditor: (id: string, editorId: string) => Promise<void>;
  publishArticle: (id: string, data: { doi?: string; issueId?: string; pageStart?: number; pageEnd?: number }) => Promise<void>;
}

const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  article: null,
  loading: false,
  error: null,
  stats: {},

  fetchArticles: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/articles', { params });
      set({ articles: response.data.data, loading: false });
    } catch (error) {
      set({ error: 'Lỗi khi tải danh sách bài báo', loading: false });
      toast.error('Lỗi khi tải danh sách bài báo');
    }
  },

  fetchArticleById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/articles/${id}`);
      set({ article: response.data.data, loading: false });
    } catch (error) {
      set({ error: 'Lỗi khi tải thông tin bài báo', loading: false });
      toast.error('Lỗi khi tải thông tin bài báo');
    }
  },

  fetchArticleStats: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/articles/stats');
      set({ stats: response.data.data, loading: false });
    } catch (error) {
      set({ error: 'Lỗi khi tải thống kê bài báo', loading: false });
      toast.error('Lỗi khi tải thống kê bài báo');
    }
  },

  createArticle: async (data: Partial<Article>) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const response = await axios.post('/api/articles', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: [response.data.data, ...state.articles],
        loading: false
      }));
      toast.success('Tạo bài báo thành công');
    } catch (error) {
      set({ error: 'Lỗi khi tạo bài báo', loading: false });
      toast.error('Lỗi khi tạo bài báo');
    }
  },

  updateArticle: async (id: string, data: Partial<Article>) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const response = await axios.put(`/api/articles/${id}/update`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: state.articles.map(article => 
          article._id === id ? response.data.data : article
        ),
        article: state.article?._id === id ? response.data.data : state.article,
        loading: false
      }));
      toast.success('Cập nhật bài báo thành công');
    } catch (error) {
      set({ error: 'Lỗi khi cập nhật bài báo', loading: false });
      toast.error('Lỗi khi cập nhật bài báo');
    }
  },

  deleteArticle: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      await axios.delete(`/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: state.articles.filter(article => article._id !== id),
        article: state.article?._id === id ? null : state.article,
        loading: false
      }));
      toast.success('Xóa bài báo thành công');
    } catch (error) {
      set({ error: 'Lỗi khi xóa bài báo', loading: false });
      toast.error('Lỗi khi xóa bài báo');
    }
  },

  changeArticleStatus: async (id: string, status: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const response = await axios.patch(`/api/articles/${id}/status`, { status, reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: state.articles.map(article => 
          article._id === id ? response.data.data : article
        ),
        article: state.article?._id === id ? response.data.data : state.article,
        loading: false
      }));
      toast.success('Thay đổi trạng thái thành công');
    } catch (error) {
      set({ error: 'Lỗi khi thay đổi trạng thái', loading: false });
      toast.error('Lỗi khi thay đổi trạng thái');
    }
  },

  assignEditor: async (id: string, editorId: string) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const response = await axios.put(`/api/articles/${id}/assign-editor`, { editorId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: state.articles.map(article => 
          article._id === id ? response.data.data : article
        ),
        article: state.article?._id === id ? response.data.data : state.article,
        loading: false
      }));
      toast.success('Chỉ định biên tập viên thành công');
    } catch (error) {
      set({ error: 'Lỗi khi chỉ định biên tập viên', loading: false });
      toast.error('Lỗi khi chỉ định biên tập viên');
    }
  },

  publishArticle: async (id: string, data: { doi?: string; issueId?: string; pageStart?: number; pageEnd?: number }) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const response = await axios.put(`/api/articles/${id}/publish`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: state.articles.map(article => 
          article._id === id ? response.data.data : article
        ),
        article: state.article?._id === id ? response.data.data : state.article,
        loading: false
      }));
      toast.success('Xuất bản bài báo thành công');
    } catch (error) {
      set({ error: 'Lỗi khi xuất bản bài báo', loading: false });
      toast.error('Lỗi khi xuất bản bài báo');
    }
  }
}));

export default useArticleStore;
