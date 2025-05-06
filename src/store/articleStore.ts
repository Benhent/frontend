import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary } from '../config/cloudinary';

interface ArticleAuthor {
  userId?: string;
  fullName: string;
  email: string;
  institution: string;
  country: string;
  isCorresponding: boolean;
  orcid?: string;
  order?: number;
}

interface ArticleFile {
  _id: string;
  articleId: string;
  fileCategory: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StatusHistory {
  _id: string;
  status: string;
  changedBy: string;
  timestamp: string;
  reason: string;
}

interface Article {
  _id: string;
  titlePrefix?: string;
  title: string;
  subtitle?: string;
  abstract: string;
  keywords: string[];
  articleLanguage: string;
  otherLanguage?: string;
  authors: ArticleAuthor[];
  status: string;
  statusHistory: StatusHistory[];
  field: { _id: string; name: string };
  secondaryFields?: { _id: string; name: string }[];
  submitterId: { _id: string; fullName: string; email: string; institution?: string; country?: string };
  editorId?: { _id: string; fullName: string; email: string };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  doi?: string;
  issueId?: string;
  pageStart?: number;
  pageEnd?: number;
  submitterNote?: string;
}

interface Issue {
  _id: string;
  title: string;
  volumeNumber: number;
  issueNumber: number;
  publicationDate: string;
  isPublished: boolean;
  articles: string[];
}

interface Journal {
  _id: string;
  name: string;
  issn: string;
  description: string;
  coverImageUrl?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ArticleStore {
  articles: Article[];
  article: Article | null;
  articleFiles: ArticleFile[];
  issues: Issue[];
  issue: Issue | null;
  journals: Journal[];
  journal: Journal | null;
  loading: boolean;
  error: string | null;
  stats: Record<string, number>;
  pagination: Pagination;
  
  // Article functions
  fetchArticles: (params?: { page?: number; limit?: number; status?: string; field?: string; submitterId?: string; editorId?: string; search?: string }) => Promise<void>;
  fetchArticleById: (id: string) => Promise<void>;
  fetchArticleStats: () => Promise<void>;
  createArticle: (data: Partial<Article>, file?: File) => Promise<string | undefined>;
  updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  changeArticleStatus: (id: string, status: string, reason: string) => Promise<void>;
  assignEditor: (id: string, editorId: string) => Promise<void>;
  publishArticle: (id: string, data: { doi?: string; issueId?: string; pageStart?: number; pageEnd?: number }) => Promise<void>;
  
  // File functions
  uploadArticleFile: (articleId: string, fileCategory: string, file: File) => Promise<void>;
  getArticleFiles: (articleId: string) => Promise<void>;
  deleteArticleFile: (fileId: string) => Promise<void>;
  setActiveFile: (articleId: string, fileId: string, fileCategory: string) => Promise<void>;
  
  // Issue and journal functions
  fetchIssues: (params?: { page?: number; limit?: number; isPublished?: boolean }) => Promise<void>;
  fetchIssueById: (id: string) => Promise<void>;
  fetchJournals: () => Promise<void>;
  fetchJournalById: (id: string) => Promise<void>;
}

const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  article: null,
  articleFiles: [],
  issues: [],
  issue: null,
  journals: [],
  journal: null,
  loading: false,
  error: null,
  stats: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  fetchArticles: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/articles', { params });
      set({ 
        articles: response.data.data, 
        pagination: response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        loading: false 
      });
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

  createArticle: async (data: Partial<Article>, file?: File) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      // 1. Upload file to Cloudinary if exists
      let fileUrl = '';
      if (file) {
        fileUrl = await uploadToCloudinary(file);
      }

      // 2. Create article with file URL
      const response = await axios.post('/api/articles', {
        ...data,
        fileUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articles: [response.data.data, ...state.articles],
        loading: false
      }));
      toast.success('Tạo bài báo thành công');
      return response.data.data._id;
    } catch (error) {
      set({ error: 'Lỗi khi tạo bài báo', loading: false });
      toast.error('Lỗi khi tạo bài báo');
      return undefined;
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
  },

  // File management functions
  uploadArticleFile: async (articleId: string, fileCategory: string, file: File) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileCategory', fileCategory);

      const response = await axios.post(`/api/article-files/${articleId}/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      set((state) => ({
        articleFiles: [...state.articleFiles, response.data.data],
        loading: false
      }));
      toast.success('Tải file lên thành công');
    } catch (error) {
      set({ error: 'Lỗi khi tải file lên', loading: false });
      toast.error('Lỗi khi tải file lên');
    }
  },

  getArticleFiles: async (articleId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/article-files/${articleId}`);
      set({ 
        articleFiles: response.data.data, 
        loading: false 
      });
    } catch (error) {
      set({ error: 'Lỗi khi lấy danh sách file', loading: false });
      toast.error('Lỗi khi lấy danh sách file');
    }
  },

  deleteArticleFile: async (fileId: string) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      await axios.delete(`/api/article-files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        articleFiles: state.articleFiles.filter(file => file._id !== fileId),
        loading: false
      }));
      toast.success('Xóa file thành công');
    } catch (error) {
      set({ error: 'Lỗi khi xóa file', loading: false });
      toast.error('Lỗi khi xóa file');
    }
  },

  setActiveFile: async (articleId: string, fileId: string, fileCategory: string) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');

      const response = await axios.put(`/api/article-files/${articleId}/set-active`, 
        { fileId, fileCategory },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      set((state) => ({
        articleFiles: state.articleFiles.map(file => {
          if (file.fileCategory === fileCategory) {
            // Set all files of this category as inactive
            return { ...file, isActive: file._id === fileId };
          }
          return file;
        }),
        loading: false
      }));
      toast.success('Đặt file chính thành công');
    } catch (error) {
      set({ error: 'Lỗi khi đặt file chính', loading: false });
      toast.error('Lỗi khi đặt file chính');
    }
  },

  // Journal and issue functions
  fetchIssues: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/issues', { params });
      set({ 
        issues: response.data.data,
        loading: false 
      });
    } catch (error) {
      set({ error: 'Lỗi khi tải danh sách số tạp chí', loading: false });
      toast.error('Lỗi khi tải danh sách số tạp chí');
    }
  },

  fetchIssueById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/issues/${id}`);
      set({ 
        issue: response.data.data,
        loading: false 
      });
    } catch (error) {
      set({ error: 'Lỗi khi tải thông tin số tạp chí', loading: false });
      toast.error('Lỗi khi tải thông tin số tạp chí');
    }
  },

  fetchJournals: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/journals');
      set({ 
        journals: response.data.data,
        loading: false 
      });
    } catch (error) {
      set({ error: 'Lỗi khi tải danh sách tạp chí', loading: false });
      toast.error('Lỗi khi tải danh sách tạp chí');
    }
  },

  fetchJournalById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/journals/${id}`);
      set({ 
        journal: response.data.data,
        loading: false 
      });
    } catch (error) {
      set({ error: 'Lỗi khi tải thông tin tạp chí', loading: false });
      toast.error('Lỗi khi tải thông tin tạp chí');
    }
  }
}));

export default useArticleStore;