import { create } from "zustand"
import apiService from "../services/api"
import useUIStore from "./uiStore"
import type { ArticleFile } from "../types/article"
import { uploadArticleFileToCloudinary } from "../config/cloudinary"

interface FileState {
  files: ArticleFile[]
}

interface FileStore extends FileState {
  uploadArticleFile: (articleId: string, fileCategory: string, file: File, round?: number) => Promise<void>
  getArticleFiles: (articleId: string, params?: { round?: number; fileCategory?: string }) => Promise<void>
  deleteArticleFile: (fileId: string) => Promise<void>
  updateFileStatus: (fileId: string, isActive: boolean) => Promise<void>
}

const useFileStore = create<FileStore>((set) => ({
  // Initial state
  files: [],

  // File operations
  uploadArticleFile: async (articleId: string, fileCategory: string, file: File, round = 1) => {
    const { setLoading, setError, showSuccessToast, showErrorToast } = useUIStore.getState()

    try {
      setLoading("uploadFile", true)
      setError("uploadFile", null)

      // 1. Upload to Cloudinary
      const fileUrl = await uploadArticleFileToCloudinary(file)

      // 2. Create file record in database
      const response = await apiService.post<ArticleFile>(`/article-files/${articleId}/upload`, {
        articleId,
        fileCategory,
        round,
        fileName: file.name,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl,
      })

      set((state) => ({
        files: [...state.files, response.data],
      }))

      showSuccessToast("File uploaded successfully")
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("uploadFile", "Failed to upload file")
      showErrorToast("Failed to upload file")
    } finally {
      setLoading("uploadFile", false)
    }
  },

  getArticleFiles: async (articleId: string, params = {}) => {
    const { setLoading, setError, showErrorToast } = useUIStore.getState()

    try {
      setLoading("files", true)
      setError("files", null)

      const response = await apiService.get<ArticleFile[]>(`/article-files/${articleId}`, params)

      set({
        files: response.data,
      })
    } catch (error) {
      console.error("Error fetching article files:", error)
      setError("files", "Failed to load article files")
      showErrorToast("Failed to load article files")
    } finally {
      setLoading("files", false)
    }
  },

  deleteArticleFile: async (fileId: string) => {
    const { setLoading, setError, showSuccessToast, showErrorToast } = useUIStore.getState()

    try {
      setLoading("deleteFile", true)
      setError("deleteFile", null)

      await apiService.delete(`/article-files/${fileId}`)

      set((state) => ({
        files: state.files.filter((file) => file._id !== fileId),
      }))

      showSuccessToast("File deleted successfully")
    } catch (error) {
      console.error("Error deleting file:", error)
      setError("deleteFile", "Failed to delete file")
      showErrorToast("Failed to delete file")
    } finally {
      setLoading("deleteFile", false)
    }
  },

  updateFileStatus: async (fileId: string, isActive: boolean) => {
    const { setLoading, setError, showSuccessToast, showErrorToast } = useUIStore.getState()

    try {
      setLoading("updateFile", true)
      setError("updateFile", null)

      const response = await apiService.put<ArticleFile>(`/article-files/${fileId}/status`, { isActive })

      set((state) => ({
        files: state.files.map((file) => (file._id === fileId ? response.data : file)),
      }))

      showSuccessToast(`File ${isActive ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      console.error("Error updating file status:", error)
      setError("updateFile", "Failed to update file status")
      showErrorToast("Failed to update file status")
    } finally {
      setLoading("updateFile", false)
    }
  },
}))

export default useFileStore