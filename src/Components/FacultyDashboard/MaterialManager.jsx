
import React, { useState } from 'react';

const MaterialManager = ({ selectedSubject, selectedSections, facultyToken }) => {
    const [materials, setMaterials] = useState({ notes: null, videos: null, modelPapers: null, syllabus: null, assignments: null });
    const [assignmentDetails, setAssignmentDetails] = useState({ dueDate: '', message: '' });
    const [activeTab, setActiveTab] = useState('upload');
    const [myUploads, setMyUploads] = useState([]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setMaterials(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleUpload = async () => {
        if (!selectedSubject || selectedSections.length === 0) {
            alert('Please select a subject and at least one section.');
            return;
        }

        const [subject, year] = selectedSubject.split(' - Year ');

        if (!facultyToken) {
            alert('Faculty authentication required. Please login again.');
            return;
        }

        try {
            for (const section of selectedSections) {
                for (const [type, file] of Object.entries(materials)) {
                    if (!file) continue;

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('year', year);
                    formData.append('section', section);
                    formData.append('subject', subject);
                    formData.append('type', type);
                    formData.append('title', file.name);

                    if (type === 'notes' || type === 'videos' || type === 'modelPapers' || type === 'syllabus') {
                        const moduleInput = document.getElementById(`${type}-module`);
                        const unitInput = document.getElementById(`${type}-unit`);
                        const module = moduleInput ? moduleInput.value : '1';
                        const unit = unitInput ? unitInput.value : '1';
                        const topicInput = document.getElementById(`${type}-topic`);
                        const topic = topicInput ? topicInput.value : '';

                        formData.append('module', module);
                        formData.append('unit', unit);
                        if (topic) formData.append('topic', topic);
                    }

                    if (type === 'assignments') {
                        formData.append('dueDate', assignmentDetails.dueDate);
                        formData.append('message', assignmentDetails.message);
                    }

                    const response = await fetch('http://localhost:5000/api/materials', {
                        method: 'POST',
                        headers: {
                            'x-faculty-token': facultyToken
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to upload ${type} for section ${section}`);
                    }

                    const result = await response.json();
                    console.log(`✅ Uploaded ${type} for section ${section}:`, result);
                }
            }

            alert(`Materials uploaded successfully to selected sections!`);
            setMaterials({ notes: null, videos: null, modelPapers: null, syllabus: null, assignments: null });
            setAssignmentDetails({ dueDate: '', message: '' });

            const form = document.getElementById('upload-form');
            if (form) form.reset();

        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const fetchMyUploads = async () => {
        if (!facultyToken) return alert('Faculty token missing');
        try {
            const res = await fetch('http://localhost:5000/api/faculty/uploads', {
                headers: { 'x-faculty-token': facultyToken }
            });
            if (!res.ok) throw new Error('Failed to fetch uploads');
            const json = await res.json();
            setMyUploads(json || []);
        } catch (err) {
            console.error(err);
            alert('Could not load uploads');
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload Materials</h2>
            <form id="upload-form">
                <div className="material-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload Files
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
                        onClick={() => setActiveTab('links')}
                    >
                        Add Links
                    </button>
                </div>

                {activeTab === 'upload' && (
                    <div className="upload-section">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                            <button type="button" className="upload-btn" onClick={fetchMyUploads}>My Uploads</button>
                        </div>
                        {myUploads && myUploads.length > 0 && (
                            <div className="uploads-list" style={{ marginBottom: 12 }}>
                                <h4>Your Recent Uploads</h4>
                                <ul>
                                    {myUploads.map(u => (
                                        <li key={u.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                                            <strong>{u.title || u.originalName}</strong>
                                            <div style={{ fontSize: '0.85rem', color: '#555' }}>{u.subject} — {u.module || '-'} / {u.unit || '-' } • {new Date(u.uploadedAt).toLocaleString()}</div>
                                            {u.url && <div><a href={u.url} target="_blank" rel="noreferrer">Open</a></div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {Object.keys(materials).map(type => (
                            <div className="form-group" key={type}>
                                <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
                                <input
                                    type="file"
                                    id={type}
                                    name={type}
                                    onChange={handleFileChange}
                                    accept={type === 'videos' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
                                />

                                {(type === 'notes' || type === 'videos' || type === 'modelPapers' || type === 'syllabus') && (
                                    <div className="module-unit-selector">
                                        <div className="form-group">
                                            <label htmlFor={`${type}-module`}>Module:</label>
                                            <select id={`${type}-module`} name={`${type}-module`}>
                                                <option value="">Select Module</option>
                                                <option value="1">Module 1</option>
                                                <option value="2">Module 2</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`${type}-unit`}>Unit:</label>
                                            <select id={`${type}-unit`} name={`${type}-unit`}>
                                                <option value="">Select Unit</option>
                                                <option value="1">Unit 1</option>
                                                <option value="2">Unit 2</option>
                                                <option value="3">Unit 3</option>
                                                <option value="4">Unit 4</option>
                                            </select>
                                            <small>Module 1: Units 1-2 | Module 2: Units 3-4</small>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`${type}-topic`}>Topic (optional):</label>
                                            <input id={`${type}-topic`} name={`${type}-topic`} placeholder="Topic name (e.g. Introduction)" />
                                        </div>
                                    </div>
                                )}

                                {type === 'assignments' && (
                                    <div className="assignment-details">
                                        <input
                                            type="datetime-local"
                                            value={assignmentDetails.dueDate}
                                            onChange={(e) => setAssignmentDetails(prev => ({...prev, dueDate: e.target.value}))}
                                            placeholder="Due Date"
                                        />
                                        <textarea
                                            placeholder="Assignment instructions..."
                                            value={assignmentDetails.message}
                                            onChange={(e) => setAssignmentDetails(prev => ({...prev, message: e.target.value}))}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        <button type="button" className="upload-btn" onClick={handleUpload}>
                            Upload to Selected Sections
                        </button>
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="links-section">
                        <p>Add video links or external resources for your subjects.</p>
                        <div className="form-group">
                            <label htmlFor="link-title">Link Title:</label>
                            <input id="link-title" placeholder="e.g., Introduction Video" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="link-url">URL:</label>
                            <input id="link-url" placeholder="https://youtube.com/..." />
                        </div>
                        <div className="form-group">
                            <label htmlFor="link-type">Type:</label>
                            <select id="link-type">
                                <option value="videos">Video</option>
                                <option value="notes">Notes</option>
                                <option value="syllabus">Syllabus</option>
                            </select>
                        </div>
                        <button type="button" className="upload-btn">
                            Add Link
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MaterialManager;
