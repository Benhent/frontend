import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useArticleStore from '../../../store/articleStore';
import { toast } from 'react-hot-toast';
import { Upload, FileText, X, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '../../../components/ui/progress';

interface Author {
  fullName: string;
  email: string;
  institution: string;
  country: string;
  isCorresponding: boolean;
  orcid?: string;
}

interface DraftData {
  title: string;
  abstract: string;
  keywords: string;
  articleLanguage: string;
  authors: Author[];
  file?: File;
}

const Postarticle = () => {
  const navigate = useNavigate();
  const { createArticle, loading } = useArticleStore();

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [articleLanguage, setArticleLanguage] = useState('en');
  const [authors, setAuthors] = useState<Author[]>([
    {
      fullName: '',
      email: '',
      institution: '',
      country: '',
      isCorresponding: true
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraft, setIsDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('articleDraft');
    if (savedDraft) {
      const draft: DraftData = JSON.parse(savedDraft);
      setTitle(draft.title);
      setAbstract(draft.abstract);
      setKeywords(draft.keywords);
      setArticleLanguage(draft.articleLanguage);
      setAuthors(draft.authors);
      setLastSaved(localStorage.getItem('articleDraftLastSaved'));
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || abstract || keywords || authors.some(a => a.fullName)) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [title, abstract, keywords, authors]);

  const saveDraft = () => {
    const draft: DraftData = {
      title,
      abstract,
      keywords,
      articleLanguage,
      authors
    };
    localStorage.setItem('articleDraft', JSON.stringify(draft));
    const now = new Date().toLocaleString();
    localStorage.setItem('articleDraftLastSaved', now);
    setLastSaved(now);
    toast.success('Đã lưu nháp');
  };

  const clearDraft = () => {
    localStorage.removeItem('articleDraft');
    localStorage.removeItem('articleDraftLastSaved');
    setLastSaved(null);
    setTitle('');
    setAbstract('');
    setKeywords('');
    setArticleLanguage('en');
    setAuthors([{
      fullName: '',
      email: '',
      institution: '',
      country: '',
      isCorresponding: true
    }]);
    setSelectedFile(null);
    toast.success('Đã xóa nháp');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(err => {
          if (err.code === 'file-too-large') {
            toast.error('File quá lớn. Kích thước tối đa là 10MB');
          } else if (err.code === 'file-invalid-type') {
            toast.error('Chỉ chấp nhận file .doc hoặc .docx');
          }
        });
      });
    }
  });

  const handleAuthorChange = (index: number, field: keyof Author, value: string | boolean) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const addAuthor = () => {
    setAuthors([...authors, {
      fullName: '',
      email: '',
      institution: '',
      country: '',
      isCorresponding: false
    }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      const newAuthors = authors.filter((_, i) => i !== index);
      setAuthors(newAuthors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      if (!selectedFile) {
        toast.error('Vui lòng chọn file bài viết');
        return;
      }

      const articleData = {
        title,
        abstract,
        keywords: keywords.split(',').map(k => k.trim()),
        articleLanguage,
        authors,
        status: isDraft ? 'draft' : 'submitted'
      };

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      await createArticle(articleData, selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success(isDraft ? 'Đã lưu nháp thành công' : 'Gửi bài viết thành công');
      clearDraft();
      navigate('/articles');
    } catch (error) {
      toast.error('Lỗi khi gửi bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gửi bài viết mới</h1>
        <div className="flex items-center space-x-4">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Đã lưu lúc: {lastSaved}
            </span>
          )}
          <button
            onClick={saveDraft}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <Save size={20} />
            <span>Lưu nháp</span>
          </button>
          {lastSaved && (
            <button
              onClick={clearDraft}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <X size={20} />
              <span>Xóa nháp</span>
            </button>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Tiêu đề bài viết</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-sm font-medium mb-2">Tóm tắt</label>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium mb-2">Từ khóa (phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-2">Ngôn ngữ bài viết</label>
          <select
            value={articleLanguage}
            onChange={(e) => setArticleLanguage(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>

        {/* Authors */}
        <div>
          <label className="block text-sm font-medium mb-2">Tác giả</label>
          {authors.map((author, index) => (
            <div key={index} className="mb-4 p-4 border rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Tác giả {index + 1}</h3>
                {authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={author.fullName}
                    onChange={(e) => handleAuthorChange(index, 'fullName', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={author.email}
                    onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Cơ quan</label>
                  <input
                    type="text"
                    value={author.institution}
                    onChange={(e) => handleAuthorChange(index, 'institution', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Quốc gia</label>
                  <input
                    type="text"
                    value={author.country}
                    onChange={(e) => handleAuthorChange(index, 'country', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={author.isCorresponding}
                    onChange={(e) => handleAuthorChange(index, 'isCorresponding', e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm">Tác giả liên hệ</label>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAuthor}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Thêm tác giả
          </button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">File bài viết (.doc, .docx)</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText size={20} />
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={24} className="mx-auto" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Thả file vào đây...'
                    : 'Kéo thả file vào đây hoặc click để chọn file'}
                </p>
                <p className="text-xs text-gray-500">Chỉ chấp nhận file .doc, .docx (tối đa 10MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-500 text-right">
              {uploadProgress}%
            </p>
          </div>
        )}

        {/* Draft Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Lưu dưới dạng nháp</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting || loading ? 'Đang xử lý...' : isDraft ? 'Lưu nháp' : 'Gửi bài viết'}
        </button>
      </form>
    </div>
  );
};

export default Postarticle;
