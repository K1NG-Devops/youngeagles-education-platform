const LessonUploader = () => {
    const [formData, setFormData] = useState({ title: '', description: '', file: null });
  
    const handleSubmit = async () => {
      const data = new FormData();
      data.append("file", formData.file);
      data.append("title", formData.title);
      data.append("description", formData.description);
  
      await fetch('/api/lessons/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Lesson Title" />
        <textarea placeholder="Description" />
        <input type="file" />
        <button>Upload</button>
      </form>
    );
  };
  