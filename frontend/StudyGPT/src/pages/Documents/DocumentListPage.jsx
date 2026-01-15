import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from '../../services/documentService';
import Spinner from "../../components/common/Spinner";
import Button from '../../components/common/Button';
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // state for upload model
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploading, setUploading] = useState(false);

    // state for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    

    const fetchDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            toast.error('Failed to fetch documents.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setUploadFile(file);
            setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if(!uploadFile || !uploadTitle) {
            toast.error('Please provide a title and select a file.');
            return ;
        }
        setUploading(true);
        // form data --- to send files, multipart/form-data (when json cannot send it)
        const formData = new FormData();
        // "key" -- value
        formData.append("file", uploadFile);
        formData.append("title", uploadTitle);

        try {
            await documentService.uploadDocument(formData);
            toast.success('Document uploaded successfully!');
            setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadTitle("");
            setLoading(true);
            fetchDocuments();
        } catch (error) {
            toast.error(error.message || 'Upload Failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteRequest = (doc) => {
        setSelectedDoc(doc);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmdelete = async () => {
        if(!selectedDoc) return;
        setDeleting(true);
        try {
            await documentService.deleteDocument(selectedDoc._id);
            toast.success(`${selectedDoc.title} deleted.`);
            setIsDeleteModalOpen(false);
            setSelectedDoc(null);
            setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
        } catch (error) {
            toast.error(error.message || "Failed to delete document.");
        } finally {
            setDeleting(false);
        }
    };

    const renderContent = () => {
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/15">
          <FileText
            className="h-7 w-7 text-cyan-400"
            strokeWidth={1.5}
          />
        </div>

        <h3 className="mb-1 text-lg font-semibold text-slate-100">
          No Documents Yet
        </h3>

        <p className="mb-6 max-w-sm text-sm text-slate-400">
          Get started by uploading your first PDF document to begin learning.
        </p>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/30"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Upload Document
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents?.map((doc) => (
        <DocumentCard
          key={doc._id}
          document={doc}
          onDelete={handleDeleteRequest}
        />
      ))}
    </div>
  );
};


    return (
  <div className="relative min-h-screen bg-slate-950 text-slate-100">
    {/* Subtle background pattern */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(56,189,248,0.08)_1px,transparent_0)] bg-[size:24px_24px]" />

    <div className="relative mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            My Documents
          </h1>
          <p className="text-sm text-slate-400">
            Manage and organize your learning materials
          </p>
        </div>

        {documents.length > 0 && (
          <Button className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/30">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        )}
      </div>

      {renderContent()}
    </div>
  </div>
)

}

export default DocumentListPage