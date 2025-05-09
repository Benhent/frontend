import { create } from "zustand"
import apiService from "../services/api"
import useUIStore from "./uiStore"
import type { ArticleAuthor } from "../types/article"

interface AuthorState {
  authors: ArticleAuthor[]
}

interface AuthorStore extends AuthorState {
  fetchArticleAuthors: (articleId: string) => Promise<void>
  createArticleAuthor: (data: Partial<ArticleAuthor>) => Promise<void>
  updateArticleAuthor: (id: string, data: Partial<ArticleAuthor>) => Promise<void>
  deleteArticleAuthor: (id: string) => Promise<void>
}

const useAuthorStore = create<AuthorStore>((set) => ({
  // Initial state
  authors: [],

  // Author operations
  fetchArticleAuthors: async (articleId: string) => {
    const { setLoading, setError, showErrorToast } = useUIStore.getState()

    try {
      setLoading("authors", true)
      setError("authors", null)

      const response = await apiService.get<ArticleAuthor[]>(`/article-authors/article/${articleId}`)

      set({
        authors: response.data,
      })
    } catch (error) {
      console.error("Error fetching article authors:", error)
      setError("authors", "Failed to load article authors")
      showErrorToast("Failed to load article authors")
    } finally {
      setLoading("authors", false)
    }
  },

  createArticleAuthor: async (data: Partial<ArticleAuthor>) => {
    const { setLoading, setError, showSuccessToast, showErrorToast } = useUIStore.getState()

    try {
      setLoading("createAuthor", true)
      setError("createAuthor", null)

      const response = await apiService.post<ArticleAuthor>("/article-authors", data)

      set((state) => ({
        authors: [...state.authors, response.data],
      }))

      showSuccessToast("Author added successfully")
    } catch (error) {
      console.error("Error creating article author:", error)
      setError("createAuthor", "Failed to add author")
      showErrorToast("Failed to add author")
    } finally {
      setLoading("createAuthor", false)
    }
  },

  updateArticleAuthor: async (id: string, data: Partial<ArticleAuthor>) => {
    const { setLoading, setError, showSuccessToast, showErrorToast } = useUIStore.getState()

    try {
      setLoading("updateAuthor", true)
      setError("updateAuthor", null)

      const response = await apiService.put<ArticleAuthor>(`/article-authors/${id}`, data)

      set((state) => ({
        authors: state.authors.map((author) => (author._id === id ? response.data : author)),
      }))

      showSuccessToast("Author updated successfully")
    } catch (error) {
      console.error("Error updating article author:", error)
      setError("updateAuthor", "Failed to update author")
      showErrorToast("Failed to update author")
    } finally {
      setLoading("updateAuthor", false)
    }
  },

  deleteArticleAuthor: async (id: string) => {
    const { setLoading, setError, showSuccessToast, showErrorToast } = useUIStore.getState()

    try {
      setLoading("deleteAuthor", true)
      setError("deleteAuthor", null)

      await apiService.delete(`/article-authors/${id}`)

      set((state) => ({
        authors: state.authors.filter((author) => author._id !== id),
      }))

      showSuccessToast("Author removed successfully")
    } catch (error) {
      console.error("Error deleting article author:", error)
      setError("deleteAuthor", "Failed to remove author")
      showErrorToast("Failed to remove author")
    } finally {
      setLoading("deleteAuthor", false)
    }
  },
}))

export default useAuthorStore